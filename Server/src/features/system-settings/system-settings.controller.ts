import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
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

@ApiTags('System Settings')
@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly settingsService: SystemSettingsService) {}

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
  @Patch()
  async updateSettings(
    @Body() updateDto: UpdateSystemSettingsDto,
  ): Promise<SystemSettings> {
    return await this.settingsService.updateSettings(updateDto);
  }
}
