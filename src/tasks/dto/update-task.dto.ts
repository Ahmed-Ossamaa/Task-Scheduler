import { PartialType } from '@nestjs/swagger';
import { CreateTaskDTO } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDTO) {}
