import { UserRoles } from '@/features/auth/types/user-interface';

export type RoleCount = {
  role: UserRoles;
  count: number;
};
export type RoleDistributionChartProps = {
  data: RoleData[];
};

type RoleData = {
  name: string;
  value: number;
  fill: string;
};

