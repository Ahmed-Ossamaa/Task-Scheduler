import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PagintaedTasks } from './types/task.response';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TaskStatus } from './enums/tasks-status.enums';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
    @InjectQueue('tasks')
    private readonly tasksQueue: Queue,
  ) {}

  async scheduleTask(taskDto: CreateTaskDTO, userId: string): Promise<Task> {
    if (new Date(taskDto.excuteAt) <= new Date()) {
      throw new BadRequestException('executeAt must be in the future');
    }
    const task = this.tasksRepo.create({
      ...taskDto,
      author: { id: userId },
    });
    await this.tasksRepo.save(task);

    const delay = new Date(taskDto.excuteAt).getTime() - Date.now();

    const job = await this.tasksQueue.add(
      'excute-task',
      { taskId: task.id },
      { delay },
    );
    task.jobId = job.id;
    await this.tasksRepo.save(task);
    return task;
  }

  async getMyTasks(userId: string): Promise<Task[]> {
    return this.tasksRepo.find({
      where: {
        author: { id: userId },
      },
    });
  }

  async getTaskById(taskId: string, userId: string): Promise<Task> {
    const task = await this.tasksRepo.findOne({
      where: {
        id: taskId,
        author: { id: userId },
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async getAllTasks(
    page: number = 1,
    limit: number = 20,
  ): Promise<PagintaedTasks> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [tasks, total] = await this.tasksRepo.findAndCount({
      where: {},
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

  async updateTask(
    taskId: string,
    taskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.tasksRepo.findOne({
      where: {
        id: taskId,
        author: { id: userId },
      },
    });
    if (!task) {
      throw new NotFoundException(
        'Task not found or you are not allowed to update it',
      );
    }

    if(task.status === TaskStatus.DONE) {
      throw new BadRequestException('Excuted tasks can not be updated');
    }

    if (taskDto.excuteAt) {
      if (new Date(taskDto.excuteAt) <= new Date()) {
        throw new BadRequestException('executeAt must be in the future');
      }

      if(task.jobId) {
        const oldJob = await this.tasksQueue.getJob(task.jobId);
        if (oldJob) {
          await oldJob.remove();
        }
      }

      const delay = new Date(taskDto.excuteAt).getTime() - Date.now();
      const newJob = await this.tasksQueue.add(
        'excute-task',
        { taskId: task.id },
        { delay },
      );
      task.jobId = newJob.id;
    }

    Object.assign(task, taskDto);
    return this.tasksRepo.save(task);
  }

  async deleteTask(taskId: string, userId: string): Promise<string> {
    const task = await this.tasksRepo.findOne({
      where: {
        id: taskId,
        author: { id: userId },
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
  
}
