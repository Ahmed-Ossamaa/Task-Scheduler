import { User } from '../entities/user.entity';
import { FindOptionsSelect } from 'typeorm';

export const defaultUserSelect: FindOptionsSelect<User> = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  role: true,
  avatar: true,
  isEmailVerified: true,
  isActive: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  organization: {
    id: true,
    name: true,
  },
};
