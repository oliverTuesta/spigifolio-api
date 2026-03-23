import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HoldingsService } from './holdings.service';
import { Holding } from './entities/holding.entity';
import { User } from '../users/entities/user.entity';
import { Asset } from '../assets/entities/asset.entity';

describe('HoldingsService', () => {
  let service: HoldingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HoldingsService,
        {
          provide: getRepositoryToken(Holding),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(Asset),
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<HoldingsService>(HoldingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
