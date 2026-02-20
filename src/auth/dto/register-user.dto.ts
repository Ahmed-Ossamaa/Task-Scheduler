import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserGender } from 'src/users/enums/user-gender.enum';

export class RegisterUserDto {
  @ApiProperty({ example: 'Ahmed Ossama' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'aossama2015@gmail' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456@Ab',description: 'minimum 8 characters, must contain uppercase, lowercase, number, and special character' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @ApiPropertyOptional({ example: 'male', enum: UserGender })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @ApiPropertyOptional({ example: 25})
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ example: '01223456789'})
  @IsOptional()
  @IsString()
  phone?: string;
}
