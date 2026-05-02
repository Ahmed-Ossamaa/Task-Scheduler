import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserGender } from '../enums/user-gender.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Ahmed Ossama' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ enum: UserGender })
  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;

  @ApiProperty({ example: 'employee@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '123456@Ab' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password!: string;
}
