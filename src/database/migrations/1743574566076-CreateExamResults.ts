import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExamResults1743574566076 implements MigrationInterface {
    name = 'CreateExamResults1743574566076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subject" character varying NOT NULL, "score" double precision NOT NULL, "studentRegistrationNumber" character varying, CONSTRAINT "PK_c36917e6f26293b91d04b8fd521" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students" ("registrationNumber" character varying NOT NULL, "foreignLanguageCode" character varying, CONSTRAINT "PK_3923ac7111bfdbdb86fcbd7e4ba" PRIMARY KEY ("registrationNumber"))`);
        await queryRunner.query(`ALTER TABLE "scores" ADD CONSTRAINT "FK_03521997bf4118fb5a12c67dd07" FOREIGN KEY ("studentRegistrationNumber") REFERENCES "students"("registrationNumber") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_03521997bf4118fb5a12c67dd07"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "scores"`);
    }

}
