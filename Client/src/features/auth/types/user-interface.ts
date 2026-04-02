export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRoles
  avatar?: string | null;
  gender?: string;
  age?: number;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  organizationId?: string | null;
  organization?:{
    id: string;
    name: string;
  }
}

export enum UserRoles {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMP = 'employee',
  GUEST = 'guest',
}

