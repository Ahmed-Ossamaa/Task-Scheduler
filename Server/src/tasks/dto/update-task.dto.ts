import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTaskDTO } from './create-task.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../enums/tasks-status.enums';

export class UpdateTaskDto extends PartialType(CreateTaskDTO) {
  @ApiPropertyOptional({ example: 'DONE', enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
