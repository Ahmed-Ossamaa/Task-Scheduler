import { User, UserRoles } from "@/features/auth/types/user-interface";

export interface CreateEmployeeDto {
  name: string;
  gender?: string;
  email: string;
  password: string;
}

export interface PaginatedUser {
  data: User[];
  total: number;
  page: number;
  lastPage: number;
}

export type StatusFilterUI = 'ALL' | 'active' | 'banned';
export type RoleFilterUI = 'ALL' | UserRoles;
export type OrgFilterUI = 'ALL' | string;