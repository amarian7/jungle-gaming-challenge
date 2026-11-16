import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Money } from '../value-objects/money.js';
import { MoneyType } from '../../infrastructure/persistence/mikro-orm/money.type.js';

@Entity()
export class Wallet {
  @PrimaryKey()
  id!: string;

  @Property({ type: MoneyType })
  balance!: Money;

  @Property({ version: true })
  version!: number;
}