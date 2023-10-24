import { type MigrationInterface, type QueryRunner } from "typeorm";

export class Migration1698165570416 implements MigrationInterface {
  name = "Migration1698165570416";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "statements" ADD "employee_id" integer`);
    await queryRunner.query(`ALTER TABLE "employees" ADD "department_id" integer`);
    await queryRunner.query(`ALTER TABLE "donations" ADD "employee_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "statements" ADD CONSTRAINT "FK_009d881952209e1685494793c6d" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" ADD CONSTRAINT "FK_678a3540f843823784b0fe4a4f2" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donations" ADD CONSTRAINT "FK_59e4058c131ee0ad9b823ff4191" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donations" DROP CONSTRAINT "FK_59e4058c131ee0ad9b823ff4191"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_678a3540f843823784b0fe4a4f2"`);
    await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_009d881952209e1685494793c6d"`);
    await queryRunner.query(`ALTER TABLE "donations" DROP COLUMN "employee_id"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "department_id"`);
    await queryRunner.query(`ALTER TABLE "statements" DROP COLUMN "employee_id"`);
  }
}
