import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { Repository } from 'typeorm';
import { ErrorLog } from './entities/error-log.entity';
import { PaginatedResult } from './types/activity-paginated-response.types';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityRepo: Repository<ActivityLog>,
    @InjectRepository(ErrorLog)
    private readonly errorRepo: Repository<ErrorLog>,
  ) {}

  /**
   * Retrieve a paginated list of all activity logs on the platform.
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Number of activity logs per page
   * @return  A promise resolving with an object containing the activity logs and pagination metadata.
   */
  async getGlobalActivity(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResult<ActivityLog>> {
    const take = Math.min(limit, 100);
    const [logs, total] = await this.activityRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * take,
      take,
    });

    return {
      data: logs,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  /**
   * Retrieves a paginated list of system errors, sorted by creation date in descending order.
   * @param {number} [page=1] - Page number
   * @param {number} [limit=5] - Number of errors per page
   * @return  A promise resolving with an object containing the system errors and pagination metadata.
   */
  async getSystemErrors(
    page: number = 1,
    limit: number = 5,
  ): Promise<PaginatedResult<ErrorLog>> {
    const take = Math.min(limit, 100);
    const [errors, total] = await this.errorRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * take,
      take,
    });

    return {
      data: errors,
      total,
      page,
      lastPage: Math.ceil(total / take) || 1,
    };
  }
}
