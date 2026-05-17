import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateOrgEntity1779025061651 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('organizations', [
      new TableColumn({ name: 'industry', type: 'varchar', isNullable: true }),
      new TableColumn({ name: 'slogan', type: 'varchar', isNullable: true }),
      new TableColumn({ name: 'cover', type: 'varchar', isNullable: true }),
      new TableColumn({
        name: 'websiteUrl',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'contactEmail',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('organizations', [
      'industry',
      'slogan',
      'cover',
      'websiteUrl',
      'contactEmail',
    ]);
  }
}
