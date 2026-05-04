import { DataSource, EntityTarget, DeepPartial, ObjectLiteral } from 'typeorm';
import { DataRetentionService } from 'src/features/background-jobs/services/data-retention.service';

type CleanupResult<T> = {
  remaining: T[];
  oldEntity: T;
  recentEntity: T;
  activeEntity: T;
};

/**
 * @desc Helper for running data cleanup job.
 *
 * It creates three versions of an entity:
 * 1. An "old" one that was soft deleted 40 days ago (should be permanently deleted).
 * 2  A "recent" one soft deleted 10 days ago (should survive).
 * 3  An "active" one that was never deleted (should survive).
 *
 * After creating them, it runs the cleanup service and returns the results
 *
 * @template T - The entity (type) to be tested ( Task, Project, etc...)
 * @param dataSource -  test database connection.
 * @param entity - The entity to be tested.
 * @param factory - factory function to create the entity (min req fields).
 * @param overrides - Any additional required or optional foreign keys
 * @returns An object containing the surviving items and the original test items for comparison.
 */

export async function runSoftDeleteCleanupTest<T extends ObjectLiteral>(
  dataSource: DataSource,
  entity: EntityTarget<T>,
  factory: (overrides?: DeepPartial<T>) => DeepPartial<T>,
  overrides?: DeepPartial<T>,
): Promise<CleanupResult<T>> {
  const service = new DataRetentionService(dataSource);
  const repo = dataSource.getRepository(entity);

  const oldDate = new Date();
  oldDate.setDate(oldDate.getDate() - 40);

  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 10);

  const oldEntity = await repo.save(
    repo.create(
      factory({ ...overrides, deletedAt: oldDate } as DeepPartial<T>),
    ),
  );

  const recentEntity = await repo.save(
    repo.create(
      factory({ ...overrides, deletedAt: recentDate } as DeepPartial<T>),
    ),
  );

  const activeEntity = await repo.save(repo.create(factory(overrides)));

  await service.emptyTrash();

  const remaining = await repo.find({ withDeleted: true });

  return {
    remaining,
    oldEntity,
    recentEntity,
    activeEntity,
  };
}
