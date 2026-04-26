import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSettings } from './entities/system-settings.entity';
import { UpdateSystemSettingsDto } from './dto/update-system-settings.dto';

@Injectable()
export class SystemSettingsService implements OnModuleInit {
  private readonly logger = new Logger(SystemSettingsService.name);
  constructor(
    @InjectRepository(SystemSettings)
    private readonly settingsRepo: Repository<SystemSettings>,
  ) {}

  async onModuleInit() {
    const settingsExist = await this.settingsRepo.findOne({ where: { id: 1 } });

    if (!settingsExist) {
      this.logger.log('Initializing default system settings...');
      const defaultSettings = this.settingsRepo.create({ id: 1 });
      await this.settingsRepo.save(defaultSettings);
    }
  }

  async getSettings(): Promise<SystemSettings> {
    const settings = await this.settingsRepo.findOne({ where: { id: 1 } });

    if (!settings) {
      throw new NotFoundException('System settings not found.');
    }

    return settings;
  }

  async updateSettings(dto: UpdateSystemSettingsDto): Promise<SystemSettings> {
    const settings = await this.settingsRepo.findOne({ where: { id: 1 } });

    if (!settings) {
      // recreate the settings
      const newSettings = this.settingsRepo.create({ id: 1, ...dto });
      return await this.settingsRepo.save(newSettings);
    }

    Object.assign(settings, dto);

    return await this.settingsRepo.save(settings);
  }

  async restoreDefaultSettings(): Promise<SystemSettings> {
    const defaultSettings = this.settingsRepo.create({ id: 1 });
    return await this.settingsRepo.save(defaultSettings);
  }
}
