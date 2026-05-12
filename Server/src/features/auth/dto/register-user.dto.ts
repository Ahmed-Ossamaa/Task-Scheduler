import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Ahmed Ossama' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'aossama2015@gmail' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456@Ab',
    description:
      'minimum 8 characters, must contain uppercase, lowercase, number, and special character',
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password!: string;
}
