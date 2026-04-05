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

export enum GrowthInterval {
  ONE_MONTH = '1 month',
  THREE_MONTHS = '3 months',
  SIX_MONTHS = '6 months',
  ONE_YEAR = '1 year',
}
