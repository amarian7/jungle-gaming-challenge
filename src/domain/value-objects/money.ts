export interface MoneyProps {
  amount: string; 
  currency: string; 
}

export class Money {
  private constructor(
    private readonly value: string,
    public readonly currency: string,
  ) {
    this.validate(value, currency);
  }

  private validate(amount: string, currency: string): void {
    if (!amount || typeof amount !== 'string') {
      throw new Error('Money amount must be a valid string');
    }

    
    const regex = /^-?\d+(\.\d{1,2})?$/;
    if (!regex.test(amount)) {
      throw new Error(`Invalid decimal amount format for Money: "${amount}". Must have up to 2 decimal places.`);
    }

    if (!currency || currency.trim() === '') {
      throw new Error('Money currency must be a valid ISO-4217 string');
    }
  }

  public static from(props: MoneyProps): Money {
    
    const normalizedAmount = Number(props.amount).toFixed(2);
    return new Money(normalizedAmount, props.currency.toUpperCase());
  }

  public static zero(currency: string = 'BRL'): Money {
    return new Money('0.00', currency.toUpperCase());
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: cannot operate between ${this.currency} and ${other.currency}`);
    }
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    const sum = (Number(this.value) + Number(other.value)).toFixed(2);
    return new Money(sum, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const sub = (Number(this.value) - Number(other.value)).toFixed(2);
    return new Money(sub, this.currency);
  }

  public negate(): Money {
    const negated = (-Number(this.value)).toFixed(2);
    return new Money(negated, this.currency);
  }

  public isZero(): boolean {
    return Number(this.value) === 0;
  }

  public isPositive(): boolean {
    return Number(this.value) > 0;
  }

  public isNegative(): boolean {
    return Number(this.value) < 0;
  }

  public isLessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return Number(this.value) < Number(other.value);
  }

  public equals(other: Money): boolean {
    return this.currency === other.currency && this.value === other.value;
  }

  public toJSON(): MoneyProps {
    return {
      amount: this.value,
      currency: this.currency,
    };
  }

  public toString(): string {
    return `${this.value} ${this.currency}`;
  }
}