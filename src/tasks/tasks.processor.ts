import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bullmq';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enums/tasks-status.enums';

@Processor('tasks')
export class TaskProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
  ) {
    super();
  }

  async process(job: Job<{ taskId: string }>): Promise<void> {
    if (job.name === 'excute-task') {
      const task = await this.tasksRepo.findOneBy({
        id: job.data.taskId,
      });

      if (!task) return;

      task.status = TaskStatus.DONE;
      await this.tasksRepo.save(task);
    }
  }
}
