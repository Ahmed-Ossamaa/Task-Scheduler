import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Ahmed Ossama' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name!: string;

  @ApiProperty({ example: 'aossama@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Compliant' })
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  subject!: string;

  @ApiProperty({ example: 'My Complaint is....' })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  message!: string;
}
