import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  static fromEntity(this: void, user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender ?? null,
      age: user.age ?? null,
      phone: user.phone ?? null,
      address: user.address ?? null,
      avatar: user.avatar ?? null,
      createdAt: user.createdAt,
      isEmailVerified: user.isEmailVerified,
      organizationId: user.organizationId ?? null,
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            logo: user.organization.logo ?? null,
          }
        : null,
    };
  }
}
