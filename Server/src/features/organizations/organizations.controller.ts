import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/features/users/enums/user-roles.enum';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/features/auth/interfaces/jwt-payload.interface';
import { CreateOrgDto } from './dto/create-org.dto';
import { RolesGuard } from 'src/features/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { ApiImageUpload } from 'src/common/decorators/api-image-upload.decorator';
import { ImageValidationPipe } from 'src/common/pipes/image-validation.pipe';
import { StorageService } from 'src/integrations/storage/storage.interface';
import { UpdateOrgNameDto } from './dto/update-org-name.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly storageService: StorageService,
  ) {}

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

  @ApiOperation({ summary: 'Upload or Update Organization Logo' })
  @ApiImageUpload('logo')
  @Patch('/update-logo')
  @Roles(UserRole.MANAGER)
  async uploadOrgLogo(
    @CurrentUser() manager: JwtPayload,
    @UploadedFile(ImageValidationPipe) file: Express.Multer.File,
  ) {
    if (!manager.organizationId) {
      throw new BadRequestException('You are not part of any organization');
    }

    const logoUrl = await this.storageService.uploadImage(
      file,
      'org_logos', //folderName
      manager.organizationId, //fileName = org_id
      true, //overwrite existing
    );

    return this.organizationsService.updateOrgLogo(
      manager.organizationId,
      logoUrl,
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
    @Body() orgDto: UpdateOrgNameDto,
  ) {
    if (!manager.organizationId) {
      throw new BadRequestException('You are not part of any organization');
    }
    return this.organizationsService.updateOrgName(
      manager.organizationId,
      orgDto.name,
    );
  }

  @ApiOperation({
    summary: 'Remove organization and all its data "Soft delete" (admin only)',
  })
  @Patch('/:orgId/delete')
  @Roles(UserRole.ADMIN)
  async removeOrganization(@Param('orgId', ParseUUIDPipe) orgId: string) {
    return this.organizationsService.removeOrganization(orgId);
  }

  @ApiOperation({
    summary: 'Restore organization and all its data "Soft delete" (admin only)',
  })
  @Patch('/:orgId/restore')
  @Roles(UserRole.ADMIN)
  async restoreOrganization(@Param('orgId', ParseUUIDPipe) orgId: string) {
    return this.organizationsService.restoreOrganization(orgId);
  }
}
