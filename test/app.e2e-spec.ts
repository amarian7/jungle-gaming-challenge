import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Wallet & Idempotency (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create wallet and process idempotent deposit', async () => {
    // 1. Cria a carteira
    const createRes = await request(app.getHttpServer())
      .post('/wallets')
      .expect(201);

    const walletId = createRes.body.id;
    expect(walletId).toBeDefined();

    // 2. Primeiro depósito com chave de idempotência
    const idempotencyKey = 'test-integration-123';
    const depositPayload = { amount: 50 };

    const firstDeposit = await request(app.getHttpServer())
      .post(`/wallets/${walletId}/deposit`)
      .set('idempotency-key', idempotencyKey)
      .send(depositPayload)
      .expect(201);

    // 3. Segundo depósito com a MESMA chave (deve retornar o cache/idempotente)
    const secondDeposit = await request(app.getHttpServer())
      .post(`/wallets/${walletId}/deposit`)
      .set('idempotency-key', idempotencyKey)
      .send(depositPayload)
      .expect(201);

    // Valida que o saldo retornado é idêntico nas duas chamadas
    expect(secondDeposit.body.balance).toEqual(firstDeposit.body.balance);
  });

  afterEach(async () => {
    await app.close();
  });
});