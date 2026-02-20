import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserGender } from '../enums/user-gender.enum';
import { UserRole } from '../enums/user-roles.enum';

export class UserResponseDto {
  @ApiProperty({ example: 'b10c6870-76fc-4e9b-b6c0-de410d1732e1' })
  id: string;

  @ApiProperty({ example: 'Ahmed Ossama' })
  name: string;

  @ApiProperty({ example: 'aossama2015@gmail' })
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiPropertyOptional({ enum: UserGender })
  gender?: UserGender;

  @ApiPropertyOptional({ example: 25 })
  age?: number;

  @ApiPropertyOptional({ example: '01223456789' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Egypt' })
  address?: string;

  @ApiPropertyOptional({example: 'https://cloudinary.com/avatar.jpg'})
  avatar?: string;

  @ApiProperty({ example: '2026-02-01T00:00:00.000Z' })
  createdAt: Date;
}
