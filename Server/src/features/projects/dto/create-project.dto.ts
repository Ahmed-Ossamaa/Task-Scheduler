import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Skill Up' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name!: string;

  @ApiPropertyOptional({ example: 'Skill Up Project: Learning platform' })
  @IsString()
  @MaxLength(300)
  @IsOptional()
  description!: string | null;
}
