import { UserRole } from 'src/features/users/enums/user-roles.enum';

export interface PlatformAnalyticsDto {
  overview: {
    totalUsers: number;
    totalOrgs: number;
    totalProjects: number;
    totalTasks: number;
  };
  roles: RoleCount[];
}

export type RoleCount = {
  role: UserRole;
  count: number;
};
