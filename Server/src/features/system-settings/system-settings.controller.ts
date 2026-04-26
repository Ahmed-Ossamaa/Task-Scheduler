import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SystemSettingsService } from './system-settings.service';
import { UpdateSystemSettingsDto } from './dto/update-system-settings.dto';
import { SystemSettings } from './entities/system-settings.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-roles.enum';
import { StorageService } from 'src/integrations/storage/storage.interface';
import { ApiImageUpload } from 'src/common/decorators/api-image-upload.decorator';

@ApiTags('System Settings')
@Controller('system-settings')
export class SystemSettingsController {
  constructor(
    private readonly settingsService: SystemSettingsService,
    private readonly storageService: StorageService,
  ) {}

  @ApiOperation({ summary: 'Get public system settings' })
  @ApiResponse({ status: 200, type: SystemSettings })
  @Get()
  async getSettings(): Promise<SystemSettings> {
    return await this.settingsService.getSettings();
  }

  @ApiOperation({ summary: 'Update system settings (Admin Only)' })
  @ApiResponse({ status: 200, type: SystemSettings })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiImageUpload('sys')
  @Patch()
  async updateSettings(
    @Body() updateDto: UpdateSystemSettingsDto,
  ): Promise<SystemSettings> {
    return await this.settingsService.updateSettings(updateDto);
  }

  @ApiOperation({ summary: ' update sysytem logo (Admin Only)' })
  @ApiResponse({ type: SystemSettings })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiImageUpload('logo')
  @Patch('logo')
  async updateLogo(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SystemSettings> {
    const logoUrl = await this.storageService.uploadImage(
      file,
      'sys-logo',
      'logo',
      true,
    );
    return await this.settingsService.updateLogo(logoUrl);
  }

  @ApiOperation({ summary: ' update sysytem landing page image (Admin Only)' })
  @ApiResponse({ type: SystemSettings })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiImageUpload('landing')
  @Patch('landing')
  async updateLandingImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SystemSettings> {
    const landingImageUrl = await this.storageService.uploadImage(
      file,
      'sys-landing',
      'landing-image',
      true,
    );
    return await this.settingsService.updateLandingImage(landingImageUrl);
  }

  @ApiOperation({ summary: 'Restore system settings to default (Admin Only)' })
  @ApiResponse({ status: 201, type: SystemSettings })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('restore-defaults')
  async restoreDefaults(): Promise<SystemSettings> {
    return await this.settingsService.restoreDefaultSettings();
  }
}
