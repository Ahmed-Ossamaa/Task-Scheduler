import { DataSource } from 'typeorm';
import { Organization } from 'src/features/organizations/entities/organization.entity';
import { Project } from 'src/features/projects/entities/project.entity';
import { User } from 'src/features/users/entities/user.entity';

import {
  organizationFactory,
  projectFactory,
  userFactory,
} from 'src/test/helpers/factories/factories';

/**
 * Utility class for seeding database with test data.
 * Manages the creation of entities required
 * to satisfy foreign key constraints across the test suite.
 */

export class TestSeedBuilder {
  constructor(private readonly ds: DataSource) {}

  async createOrganization() {
    const orgRepo = this.ds.getRepository(Organization);

    const organization = await orgRepo.save(
      orgRepo.create(organizationFactory()),
    );

    return organization;
  }

  async createProject(organizationId: string) {
    const projectRepo = this.ds.getRepository(Project);

    const project = await projectRepo.save(
      projectRepo.create(
        projectFactory({
          organizationId,
        }),
      ),
    );

    return project;
  }

  async createUser(organizationId: string) {
    const userRepo = this.ds.getRepository(User);

    const user = await userRepo.save(
      userRepo.create(
        userFactory({
          organizationId,
        }),
      ),
    );

    return user;
  }

  async seedBase() {
    const organization = await this.createOrganization();
    const user = await this.createUser(organization.id);

    const project = await this.createProject(organization.id);

    return {
      user,
      organization,
      project,
    };
  }
}
