import { type MigrationInterface, type QueryRunner } from "typeorm";

export class Migration1698509519478 implements MigrationInterface {
  name = "Migration1698509519478";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "statements" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" integer NOT NULL, "amount" numeric(39,18) NOT NULL, "employee_id" integer, CONSTRAINT "PK_7f53bcddeb706df7ea7eec10b8d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "donations" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" integer NOT NULL, "amount" numeric(39,18) NOT NULL, "employee_id" integer, CONSTRAINT "PK_c01355d6f6f50fc6d1b4a946abf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employees" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" integer NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "department_id" integer, CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "departments" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exchange_rates" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "price" numeric(39,18) NOT NULL, "currency" character varying NOT NULL, CONSTRAINT "PK_33a614bad9e61956079d817ebe2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2badd7fe7d9fce6aa939a3f9d9" ON "exchange_rates" ("currency") `,
    );
    await queryRunner.query(
      `ALTER TABLE "statements" ADD CONSTRAINT "FK_009d881952209e1685494793c6d" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donations" ADD CONSTRAINT "FK_59e4058c131ee0ad9b823ff4191" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" ADD CONSTRAINT "FK_678a3540f843823784b0fe4a4f2" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_678a3540f843823784b0fe4a4f2"`);
    await queryRunner.query(`ALTER TABLE "donations" DROP CONSTRAINT "FK_59e4058c131ee0ad9b823ff4191"`);
    await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_009d881952209e1685494793c6d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2badd7fe7d9fce6aa939a3f9d9"`);
    await queryRunner.query(`DROP TABLE "exchange_rates"`);
    await queryRunner.query(`DROP TABLE "departments"`);
    await queryRunner.query(`DROP TABLE "employees"`);
    await queryRunner.query(`DROP TABLE "donations"`);
    await queryRunner.query(`DROP TABLE "statements"`);
  }
}
