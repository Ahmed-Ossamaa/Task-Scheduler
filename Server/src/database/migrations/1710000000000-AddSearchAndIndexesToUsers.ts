import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSearchVector1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add the new column (search_vector)
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "search_vector" tsvector;
    `);

    //  Create index
    await queryRunner.query(`
      CREATE INDEX "IDX_USERS_SEARCH_VECTOR"
      ON "users"
      USING gin ("search_vector");
    `);

    //  Fill existing data
    await queryRunner.query(`
      UPDATE "users"
      SET "search_vector" =
        to_tsvector('simple',
          coalesce("name", '') || ' ' ||
          coalesce("email", '')
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_USERS_SEARCH_VECTOR";
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "search_vector";
    `);
  }
}
