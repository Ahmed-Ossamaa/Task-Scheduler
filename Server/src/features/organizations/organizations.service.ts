import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { UserService } from 'src/features/users/users.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { PaginatedOrg } from './interfaces/paginated-org.interface';
import { User } from 'src/features/users/entities/user.entity';
import { Task } from 'src/features/tasks/entities/task.entity';
import { Project } from 'src/features/projects/entities/project.entity';
import { GrowthInterval } from '../analytics/types/analytics.types';
import { OrgProfile } from './interfaces/org-profile.interface';
import { UpdateOrgProfileDto } from './dto/update-org-profile.dto';
import { StorageService } from 'src/integrations/storage/storage.interface';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
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

  async uploadOrgImage(
    orgId: string,
    file: Express.Multer.File,
    type: 'logo' | 'cover',
  ): Promise<Organization> {
    const org = await this.findOrgById(orgId);
    const imageType = type === 'logo' ? 'avatar' : 'cover';
    const imgUrl = await this.storageService.uploadImage(
      file,
      'organizations',
      `${orgId}-${type}`,
      true,
      imageType,
    );
    if (type === 'logo') org.logo = imgUrl;
    if (type === 'cover') org.cover = imgUrl;

    return this.orgRepo.save(org);
  }

  async findOrgById(orgId: string): Promise<Organization> {
    const org = await this.orgRepo.findOne({
      where: { id: orgId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }

  /**
   * Get an organization profile with employees/projects count
   * @param orgId the targeted organization
   * @returns the organization profile
   */
  async getOrgProfile(orgId: string): Promise<OrgProfile> {
    const result = await this.orgRepo
      .createQueryBuilder('org')
      .where('org.id = :id', { id: orgId })
      .select([
        'org.id AS id',
        'org.name AS name',
        'org.logo AS logo',
        'org.industry AS industry',
        'org.slogan AS slogan',
        'org.cover AS cover',
        'org.websiteUrl AS "websiteUrl"',
        'org.contactEmail AS "contactEmail"',
        'org.createdAt AS "createdAt"',
      ])
      //Emp Count
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(user.id)', 'employeeCount')
          .from(User, 'user')
          .where('user.organizationId = org.id');
      }, 'employeeCount')
      //Project Count
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(project.id)', 'projectCount')
          .from(Project, 'project')
          .where('project.organizationId = org.id');
      }, 'projectCount')
      .withDeleted()
      .getRawOne<OrgProfile>();

    if (!result) {
      throw new NotFoundException('Organization not found');
    }

    return {
      id: result.id,
      name: result.name,
      industry: result.industry,
      slogan: result.slogan,
      logo: result.logo,
      cover: result.cover,
      websiteUrl: result.websiteUrl,
      contactEmail: result.contactEmail,
      createdAt: result.createdAt,
      employeeCount: Number(result.employeeCount),
      projectCount: Number(result.projectCount),
    };
  }

  async findAllOrgs(
    page: number = 1,
    limit: number = 20,
    search?: string,
  ): Promise<PaginatedOrg> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const qb = this.orgRepo
      .createQueryBuilder('org')
      .orderBy('org.createdAt', 'DESC')
      .skip(skip)
      .take(take);

    if (search) {
      //partial match (tech => soft-tech-co)
      qb.andWhere('org.name ILIKE :search', { search: `%${search}%` });
    }
    const [orgs, total] = await qb.getManyAndCount();

    return {
      data: orgs,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async updateOrgProfile(
    orgId: string,
    dto: UpdateOrgProfileDto,
  ): Promise<Organization> {
    const org = await this.findOrgById(orgId);
    Object.assign(org, dto);
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

      // Soft Delete the Organization (trigger subscribers)
      await queryRunner.manager.softRemove(org);

      await queryRunner.commitTransaction();

      //Later: send an email to the users to notify them that their account has been deleted

      return {
        message: 'Organization and all associated data have been suspended.',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'Error deleting Organization: ',
        err instanceof Error ? err.stack : err,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async restoreOrganization(orgId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //find org even if its deleted
      const org = await queryRunner.manager.findOne(Organization, {
        where: { id: orgId },
        withDeleted: true,
      });

      if (!org) {
        throw new NotFoundException(`Organization not found.`);
      }

      if (!org.deletedAt) {
        throw new BadRequestException(`This organization is not deleted.`);
      }

      //Restore children (associated data when org was deleted) without triggering  subscribers
      await queryRunner.manager.restore(Task, { organizationId: orgId });
      await queryRunner.manager.restore(User, { organizationId: orgId });
      await queryRunner.manager.restore(Project, { organizationId: orgId });

      // Restore the org (trigger subscribers)
      await queryRunner.manager.recover(org);

      await queryRunner.commitTransaction();

      return {
        message: 'Organization and all associated data successfully restored.',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'Error restoring Organization: ',
        err instanceof Error ? err.stack : err,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get all orgs names and ids for fropdown filters (or wherever they are needed)
   */
  async findOrgsForDropdown(
    search?: string,
    limit: number = 20,
  ): Promise<{ id: string; name: string }[]> {
    const take = Math.min(limit, 20);
    const qb = this.orgRepo
      .createQueryBuilder('org')
      .select(['org.id', 'org.name'])
      .take(take);

    if (search) {
      //partial match (tech => soft-tech-co)
      qb.where('org.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy('org.name', 'ASC');

    return qb.getMany();
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

  async getDeletedOrgs(page: number = 1, limit: number = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [orgs, total] = await this.orgRepo.findAndCount({
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true,
      order: { deletedAt: 'DESC' },
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
}
