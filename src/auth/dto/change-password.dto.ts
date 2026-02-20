import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '123456@Ab' })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;


  @ApiProperty({ example: 'Ba@111222',description: 'minimum 8 characters, must contain uppercase, lowercase, number, and special character' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  newPassword: string;
}
