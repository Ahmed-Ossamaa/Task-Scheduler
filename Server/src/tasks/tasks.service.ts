import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/users/users.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PagintaedTasks } from './interfaces/task.response';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TaskStatus } from './enums/tasks-status.enums';
import { ProjectsService } from 'src/projects/projects.service';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
    @InjectQueue('tasks')
    private readonly tasksQueue: Queue,
    private readonly userService: UserService,
    private readonly projectsService: ProjectsService,
  ) {}

  async scheduleTask(
    taskDto: CreateTaskDTO,
    managerId: string,
    OrganzationId: string,
  ): Promise<Task> {
    if (new Date(taskDto.deadLine) <= new Date()) {
      throw new BadRequestException('DeadLine must be in the future');
    }
    const employee = await this.userService.validateEmployeeInOrg(
      OrganzationId,
      taskDto.assignedToId,
    );
    const project = await this.projectsService.validateProjectExistsForOrg(
      taskDto.projectId,
      OrganzationId,
    );
    const task = this.tasksRepo.create({
      ...taskDto,
      assignedById: managerId,
      assignedToId: employee.id,
      organizationId: OrganzationId,
      projectId: project.id,
    });
    await this.tasksRepo.save(task);

    const delay = new Date(taskDto.deadLine).getTime() - Date.now();

    const job = await this.tasksQueue.add(
      'EXPIRE_TASK_JOB',
      { taskId: task.id },
      { delay },
    );
    task.jobId = job.id;
    await this.tasksRepo.save(task);
    return task;
  }

  async completeTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.tasksRepo.findOne({
      where: { id: taskId, assignedToId: userId },
    });

    if (!task) throw new NotFoundException('Task not found');

    if (task.status === TaskStatus.OVERDUE) {
      throw new BadRequestException(
        'Task is already overdue. Contact manager.',
      );
    }

    if (task.status === TaskStatus.DONE) {
      return task;
    }

    // Remove the pending "Expire" job from the queue
    if (task.jobId) {
      const job = await this.tasksQueue.getJob(task.jobId);
      if (job) await job.remove();
    }

    // Mark the task as done
    task.status = TaskStatus.DONE;
    task.completedAt = new Date();
    task.jobId = undefined;

    return this.tasksRepo.save(task);
  }

  /**
   * Execute a task by its ID (mark the status as done).
   * @param {string} taskId - Task ID.
   * @returns {Promise<void>} - Promise resolving when the task is executed.
   */
  async handleTaskExpiration(taskId: string): Promise<void> {
    const task = await this.tasksRepo.findOneBy({ id: taskId });

    if (!task || task.status === TaskStatus.DONE) return;

    task.status = TaskStatus.OVERDUE;
    task.jobId = undefined;
    await this.tasksRepo.save(task);
  }

  async getUserTasks(userId: string, orgId?: string): Promise<Task[]> {
    const criteria: Record<string, string> = {
      assignedToId: userId,
    };
    if (orgId) {
      criteria.organizationId = orgId;
    }
    return this.tasksRepo.find({
      where: criteria,
      order: { createdAt: 'DESC' },
    });
  }

  async getTaskById(taskId: string, userOrgId: string): Promise<Task> {
    const task = await this.tasksRepo.findOne({
      where: { id: taskId },
      relations: ['assignedBy', 'assignedTo'],
      select: {
        assignedBy: { id: true, name: true, email: true, avatar: true },
        assignedTo: { id: true, name: true, email: true, avatar: true },
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.organizationId !== userOrgId) {
      throw new ForbiddenException(
        'You do not have permission to view this task',
      );
    }
    return task;
  }

  //Get All tasks "system wide"
  async getAllTasks(
    page: number = 1,
    limit: number = 20,
  ): Promise<PagintaedTasks> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [tasks, total] = await this.tasksRepo.findAndCount({
      where: {},
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return {
      data: tasks,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  //Get All tasks by Organization Id
  async findAllTasksInOrg(orgId: string, page: number = 1, limit: number = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [tasks, total] = await this.tasksRepo.findAndCount({
      where: { organizationId: orgId },
      order: { createdAt: 'DESC' },
      skip,
      take,
      relations: ['assignedTo'],
      select: {
        assignedTo: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    });

    return {
      data: tasks,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async updateTask(
    taskId: string,
    taskDto: UpdateTaskDto,
    managerId: string,
  ): Promise<Task> {
    const task = await this.tasksRepo.findOne({
      where: { id: taskId, assignedById: managerId },
    });

    if (!task) {
      throw new NotFoundException(
        'Task not found or you are not allowed to update it',
      );
    }

    this.validateUpdateIsAllowed(task, taskDto);

    if (taskDto.status) {
      this.updateCompletedAt(task, taskDto.status);
    }

    if (taskDto.deadLine || taskDto.status) {
      await this.updateTaskJob(task, taskDto.deadLine, taskDto.status);
    }

    Object.assign(task, taskDto);
    return this.tasksRepo.save(task);
  }

  async deleteTask(taskId: string, userId: string): Promise<string> {
    const task = await this.tasksRepo.findOne({
      where: {
        id: taskId,
        assignedById: userId,
      },
    });

    if (!task) {
      throw new NotFoundException(
        'Task not found or you are not allowed to delete it',
      );
    }
    if (task.jobId) {
      const job = await this.tasksQueue.getJob(task.jobId);
      if (job) {
        await job.remove();
      }
    }

    await this.tasksRepo.remove(task);

    return `Task with ID ${taskId} deleted successfuly`;
  }

  // Helper methods
  private validateUpdateIsAllowed(task: Task, dto: UpdateTaskDto): void {
    if (task.status === TaskStatus.OVERDUE && !dto.status) {
      throw new BadRequestException(
        'Cannot update details of an overdue task without changing its status first.',
      );
    }

    if (dto.deadLine && new Date(dto.deadLine) <= new Date()) {
      throw new BadRequestException('deadline must be in the future');
    }
  }

  private updateCompletedAt(task: Task, newStatus: TaskStatus): void {
    // If it is completed
    if (newStatus === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
      task.completedAt = new Date();
      // If it is reopened (changed from DONE or CANCELED ==> to PENDING)
    } else if (newStatus !== TaskStatus.DONE) {
      task.completedAt = null;
    }
  }

  private async updateTaskJob(
    task: Task,
    newDeadline?: Date,
    newStatus?: TaskStatus,
  ): Promise<void> {
    const targetStatus = newStatus || task.status;
    const targetDeadline = newDeadline || task.deadLine;

    //  remove old job
    if (task.jobId) {
      const oldJob = await this.tasksQueue.getJob(task.jobId);
      if (oldJob) await oldJob.remove();
      task.jobId = null;
    }

    // create a new job if the task new status is pending
    if (targetStatus === TaskStatus.PENDING) {
      const delay = new Date(targetDeadline).getTime() - Date.now();

      if (delay > 0) {
        const newJob = await this.tasksQueue.add(
          'EXPIRE_TASK_JOB',
          { taskId: task.id },
          { delay },
        );
        task.jobId = newJob.id;
      }
    }
  }
}
