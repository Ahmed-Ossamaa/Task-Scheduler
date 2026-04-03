import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';
import { PlatformAnalyticsDto } from './interfaces/platform-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly userService: UserService,
    private readonly orgsService: OrganizationsService,
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  async getPlatformAnalytics(): Promise<PlatformAnalyticsDto> {
    const [totalUsers, totalOrgs, totalProjects, totalTasks, roleCount] =
      await Promise.all([
        this.userService.getUsersCount(),
        this.orgsService.getOrgsCount(),
        this.projectsService.getProjectsCount(),
        this.tasksService.getTasksCount(),
        this.userService.getRoleDistribution(),
      ]);

    return {
      overview: {
        totalUsers,
        totalOrgs,
        totalProjects,
        totalTasks,
      },
      roles: roleCount,
    };
  }
}
