import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';

@Processor('tasks')
export class TaskProcessor extends WorkerHost {
  constructor(private readonly taskService: TasksService) {
    super();
  }

  async process(job: Job<{ taskId: string }>): Promise<void> {
    if (job.name === 'excute-task') {
      const taskId = job.data.taskId;
      await this.taskService.executeTask(taskId);
    }
  }
}
