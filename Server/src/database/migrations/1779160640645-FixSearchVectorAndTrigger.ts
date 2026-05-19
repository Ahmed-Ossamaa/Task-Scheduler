import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSearchVectorAndTrigger1779160640645 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE users
      SET search_vector =
        to_tsvector(
          'simple',
          coalesce(name, '') || ' ' || coalesce(email, '')
        );
    `);

    // 2. Create function
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_search_vector()
      RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          to_tsvector(
            'simple',
            coalesce(NEW.name, '') || ' ' ||
            coalesce(NEW.email, '')
          );
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    // 3. Create trigger
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS tsvector_update ON users;

      CREATE TRIGGER tsvector_update
      BEFORE INSERT OR UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_search_vector();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS tsvector_update ON users;
    `);

    await queryRunner.query(`
      DROP FUNCTION IF EXISTS update_search_vector;
    `);
  }
}
