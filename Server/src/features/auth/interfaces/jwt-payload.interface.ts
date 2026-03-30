import { UserRole } from 'src/features/users/enums/user-roles.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  organizationId?: string;
}
