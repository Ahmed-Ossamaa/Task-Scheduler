import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ChangePasswordDto } from './change-password.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto extends OmitType(ChangePasswordDto, [
  'oldPassword',
]) {
  @ApiProperty({ example: '123456-token-xxxxx....' })
  @IsNotEmpty()
  @IsString()
  token!: string;
}
