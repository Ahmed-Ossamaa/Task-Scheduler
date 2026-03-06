import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateOrgDto {
  @ApiProperty({ example: 'ISFP' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/logo.jpg' })
  @IsOptional()
  @IsUrl()
  logo?: string;
}
