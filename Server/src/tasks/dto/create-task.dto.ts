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
import { Type } from 'class-transformer';

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

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

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

  @ApiProperty({
    example: '2026-03-02T16:00:00.000+02:00',
    description:
      'Deadline of the task "in UTC for ex: +02:00 for egypt", after which the task will be marked as overdue',
  })
  @Type(() => Date)
  @IsDate()
  deadLine: Date; // timestamptz
}
