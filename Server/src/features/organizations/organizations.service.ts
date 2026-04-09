import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from 'src/features/users/users.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { PaginatedOrg } from './interfaces/paginated-org.interface';
import { User } from 'src/features/users/entities/user.entity';
import { Task } from 'src/features/tasks/entities/task.entity';
import { Project } from 'src/features/projects/entities/project.entity';
import { GrowthInterval } from '../analytics/types/analytics.types';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async createOrganization(
    orgDto: CreateOrgDto,
    managerId: string,
  ): Promise<{ organization: Organization; user: User }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const manager = await this.userService.findUserById(managerId);

      if (manager.organizationId) {
        throw new BadRequestException(
          'You are already part of an organization.',
        );
      }

      //creating the org
      const organization = this.orgRepo.create({ name: orgDto.name });

      //saving the org to generate id
      const savedOrg = await queryRunner.manager.save(organization);

      //adding the org ID to the manager & save
      manager.organizationId = savedOrg.id;
      const savedManager = await queryRunner.manager.save(manager);

      await queryRunner.commitTransaction();
      return {
        organization: savedOrg,
        user: savedManager,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrgLogo(orgId: string, logoUrl: string): Promise<Organization> {
    const org = await this.findOrgById(orgId);
    org.logo = logoUrl;

    return this.orgRepo.save(org);
  }

  async findOrgById(orgId: string): Promise<Organization> {
    const org = await this.orgRepo.findOne({
      where: { id: orgId },
      relations: ['users'],
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }

  async findAllOrgs(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedOrg> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [orgs, total] = await this.orgRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
    return {
      data: orgs,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async updateOrgName(orgId: string, name: string): Promise<Organization> {
    const org = await this.findOrgById(orgId);
    org.name = name;
    return this.orgRepo.save(org);
  }

  async removeOrganization(orgId: string) {
    // Transaction to ensure "All or Nothing" => remove the org and all its data
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const org = await queryRunner.manager.findOne(Organization, {
        where: { id: orgId },
      });

      if (!org) {
        throw new NotFoundException(`Organization with ID ${orgId} not found`);
      }
      // Soft Delete all Tasks in that Org
      await queryRunner.manager.softDelete(Task, { organizationId: orgId });

      // Soft Delete all Users in that Org
      await queryRunner.manager.softDelete(User, { organizationId: orgId });

      //soft Delete the projects in org
      await queryRunner.manager.softDelete(Project, { organizationId: orgId });

      // Soft Delete the Organization
      await queryRunner.manager.softRemove(org);

      await queryRunner.commitTransaction();

      //Later: send an email to the users to notify them that their account has been deleted

      return {
        message: 'Organization and all associated data have been suspended.',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Error deleting organization:', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrgsCount() {
    return this.orgRepo.count();
  }

  async getOrgGrowth(
    interval: GrowthInterval = GrowthInterval.SIX_MONTHS,
  ): Promise<{ month: Date; orgs: number }[]> {
    return this.orgRepo
      .createQueryBuilder('org')
      .select(`DATE_TRUNC('month', org."createdAt")`, 'month')
      .addSelect(`COUNT(org.id)::int`, 'orgs')
      .where(`org."createdAt" >= NOW() - CAST(:interval AS INTERVAL)`, {
        interval,
      })
      .groupBy(`DATE_TRUNC('month', org."createdAt")`)
      .orderBy(`DATE_TRUNC('month', org."createdAt")`, 'ASC')
      .getRawMany<{ month: Date; orgs: number }>();
  }
}
