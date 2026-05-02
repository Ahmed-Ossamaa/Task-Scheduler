import { TestDataSource } from 'src/test/setup/typeorm-test.config';
import { Task } from 'src/features/tasks/entities/task.entity';
import { User } from 'src/features/users/entities/user.entity';
import { Organization } from 'src/features/organizations/entities/organization.entity';
import { Project } from 'src/features/projects/entities/project.entity';
import { ContactMessage } from 'src/features/contact-messages/entities/contact-messages.entity';
import {
  taskFactory,
  userFactory,
  organizationFactory,
  projectFactory,
  contactMessageFactory,
} from '../../../test/helpers/factories/factories';
import { runSoftDeleteCleanupTest } from 'src/test/helpers/data-retention-test.helper';
import { TestSeedBuilder } from 'src/test/helpers/test-seed.builder';

/**
 * @description DataRetentionService test
 * - Test deleting in background jobs (after 30days of soft delete)
 * - USERS, ORGANIZATIONS, PROJECTS, TASKS, CONTACT-MESSAGES
 */

describe('DataRetentionService (integration)', () => {
  beforeAll(async () => {
    await TestDataSource.initialize();
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  beforeEach(async () => {
    await TestDataSource.synchronize(true);
  });

  /* ---------------- TASKS ---------------- */
  it('should clean tasks correctly', async () => {
    const seedBuilder = new TestSeedBuilder(TestDataSource);
    const { user, organization, project } = await seedBuilder.seedBase();

    const result = await runSoftDeleteCleanupTest(
      TestDataSource,
      Task,
      taskFactory,
      {
        assignedToId: user.id, //as employee (assignedby is nullable to let deleteing manager without deleting tasks)
        organizationId: organization.id,
        projectId: project.id,
      },
    );

    const ids = result.remaining.map((t) => t.id);

    expect(ids).toContain(result.recentEntity.id);
    expect(ids).toContain(result.activeEntity.id);
    expect(ids).not.toContain(result.oldEntity.id);

    expect(result.remaining).toHaveLength(2);
  });

  /* ---------------- USERS ---------------- */
  it('should clean users correctly', async () => {
    const result = await runSoftDeleteCleanupTest(
      TestDataSource,
      User,
      userFactory,
    );

    const ids = result.remaining.map((u) => u.id);

    expect(ids).toContain(result.recentEntity.id);
    expect(ids).toContain(result.activeEntity.id);
    expect(ids).not.toContain(result.oldEntity.id);

    expect(result.remaining).toHaveLength(2);
  });

  /* ---------------- ORGANIZATION ---------------- */
  it('should clean organizations correctly', async () => {
    const result = await runSoftDeleteCleanupTest(
      TestDataSource,
      Organization,
      organizationFactory,
      {
        name: 'test org',
      },
    );

    const ids = result.remaining.map((o) => o.id);

    expect(ids).toContain(result.recentEntity.id);
    expect(ids).toContain(result.activeEntity.id);
    expect(ids).not.toContain(result.oldEntity.id);

    expect(result.remaining).toHaveLength(2);
  });

  /* ---------------- PROJECT ---------------- */
  it('should clean projects correctly', async () => {
    //seed dependencies (org)
    const builder = new TestSeedBuilder(TestDataSource);
    const organization = await builder.createOrganization();

    const result = await runSoftDeleteCleanupTest(
      TestDataSource,
      Project,
      projectFactory,
      {
        organizationId: organization.id,
        name: 'test project',
      },
    );

    const ids = result.remaining.map((p) => p.id);
    expect(ids).toContain(result.recentEntity.id);
    expect(ids).toContain(result.activeEntity.id);
    expect(ids).not.toContain(result.oldEntity.id);
    expect(result.remaining).toHaveLength(2);
  });

  /* ---------------- CONTACT MESSAGES ---------------- */
  it('should clean contact messages correctly', async () => {
    const result = await runSoftDeleteCleanupTest(
      TestDataSource,
      ContactMessage,
      contactMessageFactory,
      {
        email: 'test@test.com',
        name: 'test msg',
      },
    );

    const ids = result.remaining.map((m) => m.id);

    expect(ids).toContain(result.recentEntity.id);
    expect(ids).toContain(result.activeEntity.id);
    expect(ids).not.toContain(result.oldEntity.id);

    expect(result.remaining).toHaveLength(2);
  });
});
