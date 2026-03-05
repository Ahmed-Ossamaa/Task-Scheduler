import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from 'src/users/users.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { PaginatedOrg } from './interfaces/paginated-org.interface';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';

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
  ): Promise<Organization> {
    //manager can have only one organization
    const manager = await this.userService.findUserById(managerId);
    if (manager.organizationId) {
      throw new BadRequestException('You are already part of an organization.');
    }
    //creating the org
    const orgnization = this.orgRepo.create({ name: orgDto.name });
    //saving the org to generate id
    const savedOrg = await this.orgRepo.save(orgnization);
    //adding the org ID to the manager
    manager.organizationId = savedOrg.id;
    await this.userService.saveUser(manager);
    return savedOrg;
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

  // to be tested
  async removeOrganization(orgId: string) {
    // Transaction to ensure "All or Nothing" => remove the org and all its data
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Soft Delete all Tasks in that Org
      await queryRunner.manager.softDelete(Task, { organizationId: orgId });

      // Soft Delete all Users in that Org
      await queryRunner.manager.softDelete(User, { organizationId: orgId });

      // Soft Delete the Organization
      const result = await queryRunner.manager.softDelete(Organization, orgId);

      if (result.affected === 0) {
        throw new NotFoundException(`Organization with ID ${orgId} not found`);
      }

      await queryRunner.commitTransaction();

      return {
        message: 'Organization and all associated data have been suspended.',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log('delete org error', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
