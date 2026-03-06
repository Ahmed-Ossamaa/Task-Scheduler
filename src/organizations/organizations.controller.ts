import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-roles.enum';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CreateOrgDto } from './dto/create-org.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orgnizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Create an organization (manager only)' })
  @Post('/create')
  @Roles(UserRole.MANAGER)
  async createOrganization(
    @CurrentUser() manager: JwtPayload,
    @Body() createOrgDto: CreateOrgDto,
  ) {
    return this.organizationsService.createOrganization(
      createOrgDto,
      manager.sub,
    );
  }
  @ApiOperation({ summary: 'Get my organization details (manager only)' })
  @Get('/my-org')
  @Roles(UserRole.MANAGER)
  async getMyOrg(@CurrentUser() manager: JwtPayload) {
    if (!manager.organizationId) {
      throw new BadRequestException('You are not part of any organization');
    }
    return this.organizationsService.findOrgById(manager.organizationId);
  }

  @ApiOperation({
    summary: 'Get all organizations with pagination (admin only)',
  })
  @Get('/all')
  @Roles(UserRole.ADMIN)
  async getAllOrgs(
    @Query('page', new ParseIntPipe()) page: number = 1,
    @Query('limit', new ParseIntPipe()) limit: number = 20,
  ) {
    return this.organizationsService.findAllOrgs(page, limit);
  }

  @ApiOperation({ summary: 'Change organization name (manager only)' })
  @Patch('/update-name')
  @Roles(UserRole.MANAGER)
  async updateOrgName(
    @CurrentUser() manager: JwtPayload,
    @Body() name: string,
  ) {
    if (!manager.organizationId) {
      throw new BadRequestException('You are not part of any organization');
    }
    return this.organizationsService.updateOrgName(
      manager.organizationId,
      name,
    );
  }

  @ApiOperation({
    summary: 'Remove organization and all its data "Soft delete" (admin only)',
  })
  @Patch('/remove')
  @Roles(UserRole.ADMIN)
  async removeOrganization(@Body() orgId: string) {
    return this.organizationsService.removeOrganization(orgId);
  }
}
