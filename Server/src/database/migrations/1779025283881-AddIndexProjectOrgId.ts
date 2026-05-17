import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddIndexProjectOrgId1779025283881 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'projects',
      new TableIndex({
        name: 'IDX_PROJECTS_ORGANIZATION',
        columnNames: ['organizationId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('projects', 'IDX_PROJECTS_ORGANIZATION');
  }
}
