import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1766812201737 implements MigrationInterface {
    name = 'AddUsersTable1766812201737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "catgories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "PK_b6c9f47b3b1c4d6b0d711975786" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "unit_price" integer NOT NULL, "eventId" uuid, CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total" integer NOT NULL, "date" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "userId" uuid, "order_detail" uuid, CONSTRAINT "REL_fe23f2cd179500cc36a5c38d05" UNIQUE ("order_detail"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "imageURL"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "imageUrl" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_photo" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "start_time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "end_time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "status" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" date NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" date NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_2f7107d3528147b9237b6e2a2fe" FOREIGN KEY ("categoryId") REFERENCES "catgories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_2252763f8afffcfe8d06f533ebe" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_fe23f2cd179500cc36a5c38d058" FOREIGN KEY ("order_detail") REFERENCES "order_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_fe23f2cd179500cc36a5c38d058"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_2252763f8afffcfe8d06f533ebe"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_2f7107d3528147b9237b6e2a2fe"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "end_time" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "start_time" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "title" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_photo"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "category_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" ADD "imageURL" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_detail"`);
        await queryRunner.query(`DROP TABLE "catgories"`);
    }

}
