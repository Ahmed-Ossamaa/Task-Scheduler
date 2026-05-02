import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/features/users/users.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginatedTasks } from './interfaces/paginated-tasks-interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TaskStatus } from './enums/tasks-status.enums';
import { ProjectsService } from 'src/features/projects/projects.service';
import { TaskMapper } from './mappers/task.mapper';
import { TaskResponseDto } from './dto/tasks-response.dto';
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
  ): Promise<TaskResponseDto> {
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
    task.jobId = job.id ?? null;
    await this.tasksRepo.save(task);
    return TaskMapper.fromEntity(task);
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
    task.jobId = null;

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
    task.jobId = null;
    await this.tasksRepo.save(task);
  }

  async getUserTasks(
    userId: string,
    orgId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedTasks> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [tasks, total] = await this.baseTaskQuery()
      .where('task.assignedToId = :userId', { userId })
      .andWhere('task.organizationId = :orgId', { orgId })
      .orderBy('task.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      data: tasks.map(TaskMapper.fromEntity),
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async getTaskById(taskId: string, orgId: string): Promise<TaskResponseDto> {
    const task = await this.baseTaskQuery()
      .where('task.id = :taskId', { taskId })
      .andWhere('task.organizationId = :orgId', { orgId })
      .getOne();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return TaskMapper.fromEntity(task);
  }

  async getTasksByProject(
    projectId: string,
    orgId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedTasks> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [tasks, total] = await this.baseTaskQuery()
      .where('task.projectId = :projectId', { projectId })
      .andWhere('task.organizationId = :orgId', { orgId })
      .orderBy('task.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      data: tasks.map(TaskMapper.fromEntity),
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  //Get All tasks by Organization Id
  async findAllTasksInOrg(orgId: string, page: number = 1, limit: number = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [tasks, total] = await this.baseTaskQuery()
      .where('task.organizationId = :orgId', { orgId })
      .orderBy('task.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

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

    const effectiveDeadline = dto.deadLine
      ? new Date(dto.deadLine)
      : new Date(task.deadLine);
    const effectiveStatus = dto.status || task.status;

    if (
      effectiveStatus === TaskStatus.PENDING &&
      effectiveDeadline <= new Date()
    ) {
      throw new BadRequestException(
        'Cannot set task to PENDING with a past deadline. Please provide a new future deadline first.',
      );
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
        task.jobId = newJob.id ?? null;
      }
    }
  }

  async getTasksCount() {
    return this.tasksRepo.count();
  }

  private baseTaskQuery() {
    return this.tasksRepo
      .createQueryBuilder('task')
      .leftJoin('task.project', 'project')
      .leftJoin('task.assignedTo', 'assignedTo')
      .leftJoin('task.assignedBy', 'assignedBy')
      .select([
        'task.id',
        'task.title',
        'task.description',
        'task.status',
        'task.priority',
        'task.deadLine',
        'task.completedAt',
        'task.createdAt',
        'task.updatedAt',
        'task.assignedToId',
        'task.assignedById',
        'task.projectId',
        'task.organizationId',

        'project.id',
        'project.name',

        'assignedTo.id',
        'assignedTo.name',

        'assignedBy.id',
        'assignedBy.name',
      ]);
  }
}
