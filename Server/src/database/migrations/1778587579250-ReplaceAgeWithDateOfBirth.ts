import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceAgeWithDateOfBirth1778587579250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "age";
    `);

    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "dateOfBirth" DATE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "dateOfBirth";
    `);

    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "age" integer;
    `);
  }
}
