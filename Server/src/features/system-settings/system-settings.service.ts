import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { SystemSettings } from './entities/system-settings.entity';
import { UpdateSystemSettingsDto } from './dto/update-system-settings.dto';

@Injectable()
export class SystemSettingsService implements OnModuleInit {
  private readonly logger = new Logger(SystemSettingsService.name);

  private readonly SETTINGS_ID = 1;
  private readonly CACHE_KEY = 'system_settings';

  constructor(
    @InjectRepository(SystemSettings)
    private readonly settingsRepo: Repository<SystemSettings>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async onModuleInit() {
    await this.ensureSettingsExist();
    await this.warmupCache();
  }

  async getSettings(): Promise<SystemSettings> {
    // Try cache first
    const cached = await this.cacheManager.get<SystemSettings>(this.CACHE_KEY);

    if (cached) {
      return cached;
    }

    //Fallback to DB if no cash yet
    const settings = await this.ensureSettingsExist();

    //Cache the new settings
    await this.cacheManager.set(this.CACHE_KEY, settings);

    return settings;
  }

  async updateSettings(dto: UpdateSystemSettingsDto): Promise<SystemSettings> {
    const settings = await this.ensureSettingsExist();

    Object.assign(settings, dto);

    const updated = await this.settingsRepo.save(settings);

    // set the new cash with the updated settings
    await this.cacheManager.set(this.CACHE_KEY, updated);

    return updated;
  }

  async restoreDefaultSettings(): Promise<SystemSettings> {
    const defaultSettings = this.settingsRepo.create({
      id: this.SETTINGS_ID,
    });

    const saved = await this.settingsRepo.save(defaultSettings);

    //Invalidate cache
    await this.cacheManager.del(this.CACHE_KEY);

    return saved;
  }

  // ........ HELPER METHODS .........

  /**
   * Ensure the settings exist in the database.
   * if not, create a new one with default values
   * @returns SystemSettings
   */
  private async ensureSettingsExist(): Promise<SystemSettings> {
    let settings = await this.settingsRepo.findOne({
      where: { id: this.SETTINGS_ID },
    });

    if (!settings) {
      this.logger.log('Initializing default system settings...');
      settings = this.settingsRepo.create({ id: this.SETTINGS_ID });
      settings = await this.settingsRepo.save(settings);
    }

    return settings;
  }

  /**
   * set the cache with the current settings
   */
  private async warmupCache() {
    const settings = await this.ensureSettingsExist();
    await this.cacheManager.set(this.CACHE_KEY, settings);
  }
}
