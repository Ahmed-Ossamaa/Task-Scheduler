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

// export type GrowthInterval = '1 month' | '3 months' | '6 months' | '1 year';

export enum GrowthInterval {
  ONE_MONTH = '1 month',
  THREE_MONTHS = '3 months',
  SIX_MONTHS = '6 months',
  ONE_YEAR = '1 year',
}


export interface UserGrowthData {
  month: Date;
  users: number;
}
export interface OrgGrowthData {
  month: Date;
  orgs: number;
}

export interface UsersGrowthChartProps {
  data: UserGrowthData[];
  interval: GrowthInterval;
  onIntervalChange: (interval: GrowthInterval) => void;
  isLoading?: boolean;
}