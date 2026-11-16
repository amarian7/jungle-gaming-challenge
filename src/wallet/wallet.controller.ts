import { Controller, Post, Get, Body, Param, Headers, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallet.service.js';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async create(@Body() body: { initialAmount: string }) {
    const amount = body.initialAmount ? parseFloat(body.initialAmount) : 0;
    return this.walletService.createWallet(amount);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.walletService.findById(id);
  }

  @Post(':id/deposit')
  async deposit(
    @Param('id') id: string,
    @Headers('idempotency-key') idempotencyKey: string,
    @Body() body: { amount: string },
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    const amount = parseFloat(body.amount);
    return this.walletService.deposit(id, amount, idempotencyKey);
  }
}