import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/schedule')
  @Roles(UserRole.MANAGER)
  @ApiOperation({
    summary: 'Create and Schedule a new task (Manager Only)',
  })
  async scheduleTask(
    @CurrentUser() manager: JwtPayload,
    @Body() taskDto: CreateTaskDTO,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException(
        'You must create an organization before assigning tasks.',
      );
    }
    const scheduledTask = await this.tasksService.scheduleTask(
      taskDto,
      manager.sub,
      manager.organizationId,
    );
    return scheduledTask;
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all tasks in the system (Admin Only)',
  })
  async getAllTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.tasksService.getAllTasks(+page, +limit);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({
    summary: 'See all tasks assigned to a specific user (Manager & Admin Only)',
  })
  async getUserTasks(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.tasksService.getUserTasks(userId);
  }

  @Get('/my-tasks')
  @ApiOperation({
    summary: 'Get tasks assigned to the current logged-in user',
  })
  async getMyTasks(@CurrentUser() user: JwtPayload) {
    return this.tasksService.getUserTasks(user.sub);
  }

  @Patch(':taskId/complete')
  @ApiOperation({
    summary: 'Mark a task as DONE (Stops the Overdue Timer)',
  })
  async completeTask(
    @CurrentUser() user: JwtPayload,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.tasksService.completeTask(taskId, user.sub);
  }

  @Get(':taskId')
  @ApiOperation({
    summary:
      'Get details of a specific task (from tasks assigned to current logged-in user)',
  })
  async getTaskById(
    @CurrentUser() user: JwtPayload,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.tasksService.getTaskById(taskId, user.sub);
  }

  @Patch(':taskId')
  @Roles(UserRole.MANAGER)
  @ApiOperation({
    summary: 'Update task details Deadline, Title, etc. (Manager Only)',
  })
  async updateTask(
    @CurrentUser() manager: JwtPayload,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() taskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(taskId, taskDto, manager.sub);
  }

  @Delete(':taskId')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a task (Manager & Admin Only)' })
  async deleteTask(
    @CurrentUser() user: JwtPayload,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.deleteTask(taskId, user.sub);
  }
}
