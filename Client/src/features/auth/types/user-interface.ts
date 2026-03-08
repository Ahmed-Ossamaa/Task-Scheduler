export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRoles
  avatar?: string;
  gender?: string;
  age?: number;
  phone?: string;
  address?: string;
  organizationId?: string;
  createdAt?: string;
}

export enum UserRoles {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMP = 'employee',
  GUEST = 'guest',
}

