import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskPriority } from '../enums/tasks-priority.enums';
import { TaskStatus } from '../enums/tasks-status.enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDTO {
  @ApiProperty({ example: 'Finish project' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  title: string;

  @ApiPropertyOptional({ example: 'Complete BullMQ integration' })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string;

  @ApiPropertyOptional({ example: 'high', enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ example: '2026-03-01T16:00:00.000Z' })
  @IsDate()
  excuteAt: Date; // timestamptz

  @ApiPropertyOptional({ example: 'pending', enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
