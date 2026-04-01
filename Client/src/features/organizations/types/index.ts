import { User } from "@/features/auth/types/user-interface";
import { Project } from "@/features/projects/types";

export interface CreateOrgDto {
  name: string;
  logo?: string;
}



export interface Organization {
  id: string;
  name: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?:string;
  users: User[];
  projects: Project[];
}

export interface PaginatedOrg {
  data: Organization[];
  total: number;
  page: number;
  lastPage: number;
}
