import { Type, Platform } from '@mikro-orm/core';
import { Money } from '../../../domain/value-objects/money.js';

export class MoneyType extends Type<Money, string> {
  convertToDatabaseValue(value: Money, platform: Platform): string {
    return value.toJSON().amount;
  }

  convertToJSValue(value: string, platform: Platform): Money {
    return Money.from({ amount: value, currency: 'BRL' });
  }

  getColumnType(prop: any, platform: Platform): string {
    return 'numeric(18, 2)';
  }
}