import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityRepo: Repository<ActivityLog>,
  ) {}

  async getGlobalActivity(page: number = 1, limit: number = 20) {
    const take = Math.min(limit, 100);
    const [logs, total] = await this.activityRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * take,
      take,
    });

    return {
      data: logs,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }
}
