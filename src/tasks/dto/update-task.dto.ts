import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDTO } from "./create-task.dto";


export class UpdateTaskDto extends PartialType(CreateTaskDTO){}