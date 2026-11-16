import { Migration } from '@mikro-orm/migrations';

export class Migration20261115230724 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "wallet" ("id" varchar(255) not null, "balance" numeric(18, 2) not null, "version" int not null default 1, constraint "wallet_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "wallet" cascade;`);
  }

}
