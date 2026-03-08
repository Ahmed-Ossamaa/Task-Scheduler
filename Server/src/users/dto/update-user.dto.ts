import { OmitType, PartialType } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(RegisterUserDto, ['password', 'email']),
) {}
