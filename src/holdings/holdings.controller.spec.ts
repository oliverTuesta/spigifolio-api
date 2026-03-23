import { Test, TestingModule } from '@nestjs/testing';
import { HoldingsController } from './holdings.controller';
import { HoldingsService } from './holdings.service';

describe('HoldingsController', () => {
  let controller: HoldingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoldingsController],
      providers: [
        {
          provide: HoldingsService,
          useValue: {
            create: jest.fn(),
            findByUser: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HoldingsController>(HoldingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
