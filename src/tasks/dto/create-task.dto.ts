import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskPriority } from '../enums/tasks-priority.enums';
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

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the user assigned to this task',
  })
  @IsUUID()
  @IsNotEmpty()
  assignedToId: string;

  @ApiPropertyOptional({ example: 'high', enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ example: '2026-03-01T16:00:00.000Z' })
  @IsDate()
  deadLine: Date; // timestamptz
}
