import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssetPricesService } from './asset-prices.service';
import { AssetPrice } from './entities/asset-price.entity';
import { Asset } from '../assets/entities/asset.entity';

describe('AssetPricesService', () => {
  let service: AssetPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetPricesService,
        {
          provide: getRepositoryToken(AssetPrice),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              insert: jest.fn().mockReturnThis(),
              into: jest.fn().mockReturnThis(),
              values: jest.fn().mockReturnThis(),
              orIgnore: jest.fn().mockReturnThis(),
              execute: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(Asset),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AssetPricesService>(AssetPricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
