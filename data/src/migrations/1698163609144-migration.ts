import { type MigrationInterface, type QueryRunner } from "typeorm";

export class Migration1698163609144 implements MigrationInterface {
  name = "Migration1698163609144";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "employees" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "sername" character varying NOT NULL, CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "employees"`);
  }
}
