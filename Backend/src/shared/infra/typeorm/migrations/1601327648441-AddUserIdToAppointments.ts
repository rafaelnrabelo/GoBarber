import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserIdToAppointments1601327648441 implements MigrationInterface {
    name = 'AddUserIdToAppointments1601327648441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_66dee3bea82328659a4db8e54b7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_66dee3bea82328659a4db8e54b7"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "user_id"`);
    }

}
