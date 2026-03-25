import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  ForbiddenException,
  Query,
  ParseIntPipe,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-roles.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Create a project' })
  @Post()
  @Roles(UserRole.MANAGER)
  async createProject(
    @CurrentUser() manager: JwtPayload,
    @Body() dto: CreateProjectDto,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException(
        'You must have an organization to create a project (Manager)',
      );
    }
    return this.projectsService.createProject(manager.organizationId, dto);
  }

  @ApiOperation({
    summary: 'Get all projects for an organization (Manager / Employee)',
  })
  @Get('org')
  @Roles(UserRole.MANAGER, UserRole.EMP)
  async getOrgProjects(@CurrentUser() user: JwtPayload) {
    if (!user.organizationId) return [];
    return this.projectsService.getProjectsByOrg(user.organizationId);
  }

  @ApiOperation({ summary: 'Get all projects for all organizations (Admin)' })
  @Get()
  @Roles(UserRole.ADMIN)
  async getAllProjects(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.projectsService.getAllProjects(page, limit);
  }

  @ApiOperation({
    summary: 'Soft Delete a project with its associated tasks (Manager)',
  })
  @Delete(':projectId')
  @Roles(UserRole.MANAGER)
  async deleteProject(
    @CurrentUser() manager: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException(
        'You must be a manager of an Organization to delete a project',
      );
    }
    return this.projectsService.deleteProject(
      projectId,
      manager.organizationId,
    );
  }
}
