import { User } from "@/features/auth/types/user-interface";

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