import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ActivitySubscriber } from './subscribers/activity.subscriber';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { ErrorLog } from './entities/error-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog, ErrorLog])],
  controllers: [ActivityController],
  providers: [ActivityService, ActivitySubscriber],
})
export class ActivityModule {}
