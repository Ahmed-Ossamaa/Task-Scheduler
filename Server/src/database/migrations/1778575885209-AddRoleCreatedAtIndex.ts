import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleCreatedAtIndex1778575885209 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_USERS_ROLE"
      ON "users" ("role");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_USERS_CREATED_AT"
      ON "users" ("createdAt" DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_USERS_ROLE";
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_USERS_CREATED_AT";
    `);
  }
}
