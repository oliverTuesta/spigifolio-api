import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MovementsService } from './movements.service';
import { Movement } from './entities/movement.entity';
import { Holding } from '../holdings/entities/holding.entity';
import { User } from '../users/entities/user.entity';
import { Asset } from '../assets/entities/asset.entity';

describe('MovementsService', () => {
  let service: MovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovementsService,
        {
          provide: getRepositoryToken(Movement),
          useValue: {
            create: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
              getCount: jest.fn().mockResolvedValue(0),
            })),
          },
        },
        {
          provide: getRepositoryToken(Holding),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(Asset),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn((fn: (m: unknown) => Promise<unknown>) =>
              fn({
                getRepository: () => ({
                  create: jest.fn((x: unknown) => x),
                  save: jest.fn((x: unknown) => Promise.resolve(x)),
                  findOne: jest.fn(),
                  findOneOrFail: jest.fn(),
                  remove: jest.fn(),
                }),
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<MovementsService>(MovementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
