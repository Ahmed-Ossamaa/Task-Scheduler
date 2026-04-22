import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Organization } from 'src/features/organizations/entities/organization.entity';
import { User } from 'src/features/users/entities/user.entity';
import { Task } from 'src/features/tasks/entities/task.entity';
import { Project } from 'src/features/projects/entities/project.entity';
import { ContactMessage } from 'src/features/contact-messages/entities/contact-messages.entity';

@Injectable()
export class DataRetentionService {
  private readonly logger = new Logger(DataRetentionService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Permanently deletes any soft-deleted records older than 30 days.
   */
  async emptyTrash() {
    this.logger.log('Starting 30-day data retention cleanup...');

    // Calculate the  30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete Tasks
      const tasksResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Task)
        .where('deletedAt IS NOT NULL')
        .andWhere('deletedAt <= :date', { date: thirtyDaysAgo })
        .execute();

      //Delete Projects
      const projectsResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Project)
        .where('deletedAt IS NOT NULL')
        .andWhere('deletedAt <= :date', { date: thirtyDaysAgo })
        .execute();

      //Delete Users
      const usersResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('deletedAt IS NOT NULL')
        .andWhere('deletedAt <= :date', { date: thirtyDaysAgo })
        .execute();

      //Delete Orgs
      const orgsResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Organization)
        .where('deletedAt IS NOT NULL')
        .andWhere('deletedAt <= :date', { date: thirtyDaysAgo })
        .execute();

      const messageResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(ContactMessage)
        .where('deletedAt IS NOT NULL')
        .andWhere('deletedAt <= :date', { date: thirtyDaysAgo })
        .execute();

      await queryRunner.commitTransaction();

      this.logger.log(
        `Cleanup complete. Purged: ${tasksResult.affected || 0} Tasks, ` +
          `${projectsResult.affected || 0} Projects, ${usersResult.affected || 0} Users, ` +
          `${orgsResult.affected || 0} Orgs.` +
          `${messageResult.affected || 0} Messages.`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'Failed to run data retention cleanup',
        error instanceof Error ? error.stack : error,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
