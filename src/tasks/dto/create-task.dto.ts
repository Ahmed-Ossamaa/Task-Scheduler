import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { TaskPriority } from "../enums/tasks-priority.enums";
import { TaskStatus } from "../enums/tasks-status.enums";


export class CreateTaskDTO{
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    title:string;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    description?:string

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority

    @IsDate()
    excuteAt:Date // timestamptz

    @IsEnum(TaskStatus)
    status: TaskStatus
}