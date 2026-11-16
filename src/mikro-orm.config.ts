import { IdempotencyKey } from './domain/entities/idempotency-key.entity.js';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Wallet } from './domain/entities/wallet.entity.js';
import { MoneyType } from './infrastructure/persistence/mikro-orm/money.type.js';

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  dbName: process.env.DB_NAME || 'jungle_gaming',
  entities: [Wallet, IdempotencyKey],
  types: [new MoneyType()],
  migrations: {
    path: 'dist/infrastructure/persistence/migrations',
    pathTs: 'src/infrastructure/persistence/migrations',
  },
});