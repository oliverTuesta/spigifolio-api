import { Test, TestingModule } from '@nestjs/testing';
import { AssetPricesController } from './asset-prices.controller';
import { AssetPricesService } from './asset-prices.service';

describe('AssetPricesController', () => {
  let controller: AssetPricesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetPricesController],
      providers: [
        {
          provide: AssetPricesService,
          useValue: {
            create: jest.fn(),
            findByAsset: jest.fn(),
            findLatestByAsset: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AssetPricesController>(AssetPricesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
