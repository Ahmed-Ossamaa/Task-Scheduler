import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';

@Processor('tasks')
export class TaskProcessor extends WorkerHost {
  private readonly logger = new Logger(TaskProcessor.name);
  constructor(private readonly taskService: TasksService) {
    super();
  }

  async process(job: Job<{ taskId: string }>): Promise<void> {
    if (job.name === 'EXPIRE_TASK_JOB') {
      const taskId = job.data.taskId;
      this.logger.log(`Processing [EXPIRE_TASK_JOB] => ${taskId}`);
      // await this.taskService.handleTaskExpiration(taskId);
      try {
        await this.taskService.handleTaskExpiration(taskId);
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error(
            `Failed processing task expiration: ${taskId}`,
            error.stack,
          );
        } else {
          this.logger.error(`Failed processing task expiration: ${taskId}`);
        }

        throw error;
      }
    }
  }
}
