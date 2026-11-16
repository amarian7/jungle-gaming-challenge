import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Wallet } from '../domain/entities/wallet.entity.js';
import { IdempotencyKey } from '../domain/entities/idempotency-key.entity.js';
import { WalletController } from './wallet.controller.js';
import { WalletService } from './wallet.service.js';

@Module({
  imports: [MikroOrmModule.forFeature([Wallet, IdempotencyKey])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}