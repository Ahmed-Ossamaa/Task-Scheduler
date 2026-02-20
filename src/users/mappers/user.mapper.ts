import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      age: user.age,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }
}
