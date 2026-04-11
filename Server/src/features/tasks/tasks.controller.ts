import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/features/auth/interfaces/jwt-payload.interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/features/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/features/users/enums/user-roles.enum';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  //--------Static GET Routes--------

  @ApiOperation({
    summary: 'Get tasks assigned to the current user (employee/manager)',
  })
  @Get('my-tasks')
  @Roles(UserRole.EMP, UserRole.MANAGER)
  async getMyTasks(@CurrentUser() user: JwtPayload) {
    if (!user.organizationId) {
      return [];
    }
    return this.tasksService.getUserTasks(user.sub, user.organizationId);
  }

  @ApiOperation({
    summary:
      'Get all tasks assigned to employees in the organization (Manager Only)',
  })
  @Roles(UserRole.MANAGER)
  @Get('org')
  async getAllTasksInOrg(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @CurrentUser() manager: JwtPayload,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException(
        'You must create an organization before assigning tasks.',
      );
    }
    const tasks = await this.tasksService.findAllTasksInOrg(
      manager.organizationId,
      page,
      limit,
    );
    return tasks;
  }

  @ApiOperation({
    summary: 'Get all tasks in the system (Admin Only)',
  })
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @Get()
  @Roles(UserRole.ADMIN)
  async getAllTasks(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.tasksService.getAllTasks(page, limit);
  }

  //--------Prefixed Dynamic Routes--------

  @ApiOperation({
    summary:
      "See all tasks assigned to a specific user within Manager's organization (Manager)",
  })
  @Get('user/:userId')
  @Roles(UserRole.MANAGER)
  async getUserTasks(
    @CurrentUser() manager: JwtPayload,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    if (!manager.organizationId) {
      throw new BadRequestException('You dont belong to any organization');
    }

    return this.tasksService.getUserTasks(userId, manager.organizationId);
  }

  @ApiOperation({
    summary: 'Get all tasks for a specific project (within your org)',
  })
  @Get('project/:projectId')
  async getProjectTasks(
    @CurrentUser() user: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    if (!user.organizationId)
      throw new ForbiddenException('You are not part of any organization');
    return this.tasksService.getTasksByProject(projectId, user.organizationId);
  }

  // -------- Static POST Routes --------

  @ApiOperation({
    summary: 'Create and Schedule a new task (Manager Only)',
  })
  @Post()
  @Roles(UserRole.MANAGER)
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

  // --------Direct ID Dynamic Routes --------

  @ApiOperation({
    summary: 'Employee mark a task as DONE (Stops the Overdue Timer)',
  })
  @Patch(':taskId/complete')
  async completeTask(
    @CurrentUser() user: JwtPayload,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.tasksService.completeTask(taskId, user.sub);
  }

  @ApiOperation({ summary: 'Get details of a specific task (within your org)' })
  @Get(':taskId')
  async getTaskById(
    @CurrentUser() user: JwtPayload,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    if (!user.organizationId) {
      throw new ForbiddenException('You are not part of any organization');
    }
    return this.tasksService.getTaskById(taskId, user.organizationId);
  }

  @ApiOperation({
    summary: 'Update task details Deadline, Title, etc. (Manager Only)',
  })
  @Patch(':taskId')
  @Roles(UserRole.MANAGER)
  async updateTask(
    @CurrentUser() manager: JwtPayload,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() taskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(taskId, taskDto, manager.sub);
  }

  // --------Delete Routes --------
  @ApiOperation({ summary: 'Delete a task (Admin/Manager)' })
  @Delete(':taskId')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async deleteTask(
    @CurrentUser() user: JwtPayload,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.deleteTask(taskId, user.sub);
  }
}
