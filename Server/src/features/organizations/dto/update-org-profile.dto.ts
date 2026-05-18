import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  IsEmail,
  MaxLength,
} from 'class-validator';

export class UpdateOrgProfileDto {
  @ApiPropertyOptional({ example: 'ETS' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: 'Software' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  industry?: string;

  @ApiPropertyOptional({ example: 'your company slogan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slogan?: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/logo.jpg' })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @ApiPropertyOptional({ example: 'support@domain.com' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;
}
