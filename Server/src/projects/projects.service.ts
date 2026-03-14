import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { PaginatedProject } from './interfaces/paginated-project.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
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
  ): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId, organizationId: orgId },
    });

    if (!project) {
      throw new NotFoundException(
        'Project not found or does not belong to your organization',
      );
    }

    return project;
  }

  async getProjectsByOrg(orgId: string) {
    return this.projectRepo.find({
      where: { organizationId: orgId },
      order: { createdAt: 'DESC' },
    });
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
}
