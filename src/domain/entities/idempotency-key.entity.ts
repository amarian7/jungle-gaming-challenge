import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'idempotency_keys' })
export class IdempotencyKey {
  @PrimaryKey()
  key!: string;

  @Property({ type: 'json' })
  response!: any;

  @Property({ type: 'datetime', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();
}