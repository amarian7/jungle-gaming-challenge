import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Wallet } from '../domain/entities/wallet.entity.js';
import { Money } from '../domain/value-objects/money.js';
import { randomUUID } from 'crypto';

@Injectable()
export class WalletService implements OnModuleInit {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: any,
  ) {}

  async onModuleInit() {
    try {
      const em = this.walletRepository.getEntityManager();
      await em.getConnection().execute(`
        CREATE TABLE IF NOT EXISTS idempotency_keys (
          key VARCHAR(255) PRIMARY KEY,
          response JSONB NOT NULL
        );
      `);
    } catch (e) {}
  }

  async createWallet(initialAmount: number = 0): Promise<Wallet> {
    const wallet = new Wallet();
    wallet.id = randomUUID();
    wallet.balance = new (Money as any)(initialAmount.toString(), 'BRL');
    
    await this.walletRepository.getEntityManager().persistAndFlush(wallet);
    return wallet;
  }

  async findById(id: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({ id });
  }

  async deposit(id: string, amount: number, idempotencyKey?: string): Promise<any> {
    const em = this.walletRepository.getEntityManager();

    // 1. Verifica idempotência via SQL direto (sem erro de entidade)
    if (idempotencyKey) {
      const rows = await em.getConnection().execute(
        'SELECT response FROM idempotency_keys WHERE key = ?',
        [idempotencyKey]
      );
      if (rows && rows.length > 0) {
        return rows[0].response;
      }
    }

    // 2. Lógica normal de depósito
    const wallet = await this.findById(id);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.balance = wallet.balance.add(new (Money as any)(amount.toString(), 'BRL'));
    await em.flush();

    const response = {
      id: wallet.id,
      balance: wallet.balance.toString(),
      version: wallet.version,
    };

    // 3. Salva a chave via SQL direto
    if (idempotencyKey) {
      await em.getConnection().execute(
        'INSERT INTO idempotency_keys (key, response) VALUES (?, ?)',
        [idempotencyKey, JSON.stringify(response)]
      );
    }

    return response;
  }
}