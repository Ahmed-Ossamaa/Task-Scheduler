import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/schedule')
  async scheduleTask(
    @CurrentUser() user: JwtPayload,
    @Body() taskDto: CreateTaskDTO,
  ) {
    return this.tasksService.scheduleTask(taskDto, user.id);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  async getAllTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.tasksService.getAllTasks(+page, +limit);
  }

  @Get('/my-tasks')
  async getMyTasks(@CurrentUser() user: JwtPayload) {
    return this.tasksService.getMyTasks(user.id);
  }

  @Get(':taskId')
  async getTaskById(
    @CurrentUser() user: JwtPayload,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.getTaskById(taskId, user.id);
  }

  @Patch(':taskId')
  async updateTask(
    @CurrentUser() user: JwtPayload,
    @Param('taskId') taskId: string,
    @Body() taskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(taskId, taskDto, user.id);
  }

  @Delete(':taskId')
  async deleteTask(
    @CurrentUser() user: JwtPayload,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.deleteTask(taskId, user.id);
  }
}
