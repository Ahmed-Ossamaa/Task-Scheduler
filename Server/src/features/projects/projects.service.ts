import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { PaginatedProject } from './interfaces/paginated-project.interface';
import { Task } from 'src/features/tasks/entities/task.entity';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    private readonly dataSource: DataSource,
  ) {}

  async createProject(orgId: string, dto: CreateProjectDto) {
    const project = this.projectRepo.create({
      ...dto,
      organizationId: orgId,
    });
    return this.projectRepo.save(project);
  }

  async getProjectById(id: string) {
    const project = await this.projectRepo.findOne({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async validateProjectExistsForOrg(
    projectId: string,
    orgId: string,
    withDeleted: boolean = false,
  ): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId, organizationId: orgId },
      withDeleted,
    });

    if (!project) {
      throw new NotFoundException(
        'Project not found or does not belong to your organization',
      );
    }

    return project;
  }

  async getProjectsByOrg(
    orgId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedProject> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [projects, total] = await this.projectRepo.findAndCount({
      where: { organizationId: orgId },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return {
      data: projects,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async getAllProjects(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedProject> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [projects, total] = await this.projectRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
    return {
      data: projects,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async updateProject(projectId: string, orgId: string, dto: UpdateProjectDto) {
    const project = await this.validateProjectExistsForOrg(projectId, orgId);
    Object.assign(project, dto);
    return this.projectRepo.save(project);
  }

  async deleteProject(
    projectId: string,
    orgId: string,
  ): Promise<{ message: string }> {
    //check if this project exists in this org
    await this.validateProjectExistsForOrg(projectId, orgId);
    // Transaction to ensure "All or Nothing"
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //soft delete tasks in this project
      await queryRunner.manager.softDelete(Task, { projectId });

      //soft delete the project
      await queryRunner.manager.softDelete(Project, projectId);
      await queryRunner.commitTransaction();
      //Later: maybe send an email to the users to notify them that their project and tasks have been deleted
      return {
        message:
          'Project and all associated tasks have been deleted successfully',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'Error deleting project',
        err instanceof Error ? err.stack : err,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async getProjectsCount() {
    return this.projectRepo.count();
  }

  async restoreProject(projectId: string, managerOrgId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await this.validateProjectExistsForOrg(
        projectId,
        managerOrgId,
        true,
      );

      if (!project.deletedAt) {
        throw new BadRequestException('This project is not deleted.');
      }
      //Restore the tasks and project (doesnt trigger subscribers)
      await queryRunner.manager.restore(Task, { projectId: projectId });
      await queryRunner.manager.restore(Project, { id: projectId });

      await queryRunner.commitTransaction();

      return { message: 'Project restored successfully.' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'Error restoring project',
        err instanceof Error ? err.stack : err,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getDeletedProjects(
    orgId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedProject> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [projects, total] = await this.projectRepo.findAndCount({
      where: {
        organizationId: orgId,
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
      order: {
        deletedAt: 'DESC',
      },
      take,
      skip,
    });

    return {
      data: projects,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }
}
