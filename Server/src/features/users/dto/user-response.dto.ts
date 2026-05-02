import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserGender } from '../enums/user-gender.enum';
import { UserRole } from '../enums/user-roles.enum';

export class UserResponseDto {
  @ApiProperty({ example: 'b10c6870-76fc-4e9b-b6c0-de410d1732e1' })
  id!: string;

  @ApiProperty({ example: 'Ahmed Ossama' })
  name!: string;

  @ApiProperty({ example: 'aossama2015@gmail' })
  email!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  organizationId!: string | null;

  @ApiPropertyOptional({
    example:
      '{"id":"123e4567-xxxx-xx....","name":"My Org" ,"logo":"https://cloudinary.com/logo.jpg"}',
  })
  organization!: {
    id: string;
    name: string;
    logo: string | null;
  } | null;

  @ApiPropertyOptional({ enum: UserGender })
  gender!: UserGender | null;

  @ApiPropertyOptional({ example: 25 })
  age!: number | null;

  @ApiPropertyOptional({ example: '01223456789' })
  phone!: string | null;

  @ApiPropertyOptional({ example: 'Egypt' })
  address!: string | null;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/avatar.jpg' })
  avatar!: string | null;

  @ApiProperty({ example: '2026-02-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: true })
  isEmailVerified!: boolean;
}
