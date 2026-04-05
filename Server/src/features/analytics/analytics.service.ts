import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';
import { GrowthInterval, PlatformAnalyticsDto } from './types/analytics.types';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly userService: UserService,
    private readonly orgsService: OrganizationsService,
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  /**
   * Retrieves platform analytics, including total users, organizations, projects, tasks, and role distribution.
   *
   * @returns A promise that resolves to an object containing platform analytics.
   */
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

  /**
   * Returns the user growth over the given interval.
   *
   * @param {GrowthInterval} interval - The interval for which the user growth should be returned.
   * @returns  a promise that resolves to an array of user growth objects, each containing the month and the number of users that joined during that month.
   */
  async getUserGrowth(
    interval: GrowthInterval,
  ): Promise<{ month: Date; users: number }[]> {
    return this.userService.getUserGrowth(interval);
  }
}
