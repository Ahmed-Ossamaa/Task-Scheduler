import { User } from "../entities/user.entity";

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  lastPage: number;
}