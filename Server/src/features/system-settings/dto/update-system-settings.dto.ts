import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSystemSettingsDto {
  @ApiPropertyOptional({ example: 'Alexandria, Egypt' })
  @IsOptional()
  @IsString()
  appName?: string;

  @ApiPropertyOptional({ example: 'support@taskflow.com' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+0125550123' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'Alexandria, Egypt' })
  @IsOptional()
  @IsString()
  contactCityAddress?: string;

  @ApiPropertyOptional({ example: '123 street-name St., district name' })
  @IsOptional()
  @IsString()
  contactStreetAddress?: string;

  @ApiPropertyOptional({ description: 'URL string for the uploaded logo' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({
    description: 'URL string for the landing page hero image',
  })
  @IsOptional()
  @IsString()
  landingPageImage?: string;

  @ApiPropertyOptional({ description: 'URL string for the dashboard banner' })
  @IsOptional()
  @IsString()
  banner?: string;

  @ApiPropertyOptional({ example: 'https://www.facebook.com/xx' })
  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @ApiPropertyOptional({ example: 'https://www.twitter.com/xx' })
  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @ApiPropertyOptional({ example: 'https://www.instagram.com/xx' })
  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @ApiPropertyOptional({ example: 'https://www.youtube.com/xx' })
  @IsOptional()
  @IsString()
  youtubeUrl?: string;

  @ApiPropertyOptional({ example: 'https://www.ticktok.com/xx' })
  @IsOptional()
  @IsString()
  ticktokUrl?: string;

  @ApiPropertyOptional({ example: 'https://www.linkedin.com/xx' })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;
}
