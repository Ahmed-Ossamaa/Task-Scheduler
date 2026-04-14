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
  Patch,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/features/users/enums/user-roles.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  //-------- GET Routes--------

  @ApiOperation({
    summary:
      'Get all projects for an organization paginated (Manager / Employee)',
  })
  @Get('org')
  @Roles(UserRole.MANAGER, UserRole.EMP)
  async getOrgProjects(
    @CurrentUser() user: JwtPayload,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    if (!user.organizationId) {
      throw new ForbiddenException('You are not assigned to an organization.');
    }
    return this.projectsService.getProjectsByOrg(
      user.organizationId,
      page,
      limit,
    );
  }

  @ApiOperation({
    summary: 'Get deleted projects for an organization (Manager)',
  })
  @Get('archived')
  @Roles(UserRole.MANAGER)
  async getArchivedProjects(
    @CurrentUser() manager: JwtPayload,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException('You are not assigned to an organization.');
    }
    return this.projectsService.getDeletedProjects(
      manager.organizationId,
      page,
      limit,
    );
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

  // -------- POST Routes --------

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

  // -------- PATCH Routes --------

  @ApiOperation({
    summary:
      'Restore a project (soft deleted) with its associated tasks (Manager)',
  })
  @Patch(':projectId/restore')
  @Roles(UserRole.MANAGER)
  async restoreProject(
    @CurrentUser() manager: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException(
        'You must be a manager of an Organization to restore a project',
      );
    }
    return this.projectsService.restoreProject(
      projectId,
      manager.organizationId,
    );
  }

  @ApiOperation({ summary: 'Update a project (Manager)' })
  @Patch(':projectId')
  @Roles(UserRole.MANAGER)
  async updateProject(
    @CurrentUser() manager: JwtPayload,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException(
        'You must be a manager of an Organization to update a project',
      );
    }
    return this.projectsService.updateProject(
      projectId,
      manager.organizationId,
      dto,
    );
  }

  // -------- DELETE Routes --------

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
