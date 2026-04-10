import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { DataRetentionService } from '../services/data-retention.service';

@Processor('system-maintenance')
export class DataRetentionProcessor extends WorkerHost {
  private readonly logger = new Logger(DataRetentionProcessor.name);

  constructor(private readonly dataRetentionService: DataRetentionService) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === 'empty-trash') {
      this.logger.log(`Processing background job: [${job.name}]`);

      await this.dataRetentionService.emptyTrash();
    }
  }
}
