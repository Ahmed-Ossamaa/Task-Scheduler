import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';

@Processor('tasks')
export class TaskProcessor extends WorkerHost {
  constructor(private readonly taskService: TasksService) {
    super();
  }

  async process(job: Job<{ taskId: string }>): Promise<void> {
    if (job.name === 'EXPIRE_TASK_JOB') {
      console.log(`Processing \t [EXPIRE_TASK_JOB] => ${job.data.taskId}\n`);
      const taskId = job.data.taskId;
      await this.taskService.handleTaskExpiration(taskId);
    }
  }
}
