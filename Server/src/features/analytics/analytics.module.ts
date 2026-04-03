import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UserModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  controllers: [
    AnalyticsController,
    UserModule,
    OrganizationsModule,
    ProjectsModule,
    TasksModule,
  ],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
