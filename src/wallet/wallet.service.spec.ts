import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Wallet } from '../domain/entities/wallet.entity';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: {
            findOne: jest.fn(),
            getEntityManager: jest.fn().mockReturnValue({
              persistAndFlush: jest.fn(),
              flush: jest.fn(),
              getConnection: jest.fn().mockReturnValue({
                execute: jest.fn().mockResolvedValue([]),
              }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});