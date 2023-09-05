import {MigrationInterface, QueryRunner} from "typeorm";

export class v31693903274937 implements MigrationInterface {
    name = 'v31693903274937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "favoritesCount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "favoritesCount" integer NOT NULL DEFAULT '0'`);
    }

}
