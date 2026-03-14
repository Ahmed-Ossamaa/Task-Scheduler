import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  ForbiddenException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-roles.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.MANAGER)
  async createProject(
    @CurrentUser() manager: JwtPayload,
    @Body() dto: CreateProjectDto,
  ) {
    if (!manager.organizationId) {
      throw new ForbiddenException(
        'You must have an organization to create a project.',
      );
    }
    return this.projectsService.createProject(manager.organizationId, dto);
  }

  @Get('org')
  @Roles(UserRole.MANAGER, UserRole.EMP)
  async getOrgProjects(@CurrentUser() user: JwtPayload) {
    if (!user.organizationId) return [];
    return this.projectsService.getProjectsByOrg(user.organizationId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllProjects(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.projectsService.getAllProjects(page, limit);
  }
}
