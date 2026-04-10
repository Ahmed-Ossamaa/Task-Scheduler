import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { DataRetentionService } from './services/data-retention.service';
import { DataRetentionProcessor } from './processors/data-retention.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'system-maintenance',
    }),
  ],
  providers: [DataRetentionService, DataRetentionProcessor],
})
export class BackgroundJobsModule implements OnModuleInit {
  private readonly logger = new Logger(BackgroundJobsModule.name);
  constructor(
    @InjectQueue('system-maintenance')
    private readonly maintenanceQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  // needed onInit here cause its not event driven job ,
  // its wont be triggered by user , but it will be triggered on boot
  async onModuleInit() {
    this.logger.log('Registering background jobs...');
    const cronSchedule = this.configService.get<string>(
      'app.dataRetentionCron',
    );

    await this.maintenanceQueue.add(
      'empty-trash',
      {},
      {
        repeat: {
          pattern: cronSchedule,
        },
        jobId: 'schedule-empty-trash',
      },
    );
  }
}
