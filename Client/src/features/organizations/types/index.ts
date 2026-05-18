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
  cover: string;
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

export interface CreateOrgResponse {
  organization: Organization;
  user: User;
}

export interface OrgProfile {
  id: string;
  name: string;
  industry: string | null;
  slogan: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
  logo: string  | null;
  cover: string | null;
  createdAt: string;
  employeeCount: number;
  projectCount: number;
}
