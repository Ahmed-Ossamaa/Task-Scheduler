import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrgNameTrgmIndex1778758702367 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    // Create  GIN index on the organizations 'name'
    // Using gin_trgm_ops for ILIKE '%anything%'
    await queryRunner.query(`
      CREATE INDEX "IDX_ORG_NAME_TRGM" 
      ON "organizations" 
      USING gin ("name" gin_trgm_ops);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ORG_NAME_TRGM";`);
  }
}
