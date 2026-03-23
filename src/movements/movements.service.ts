import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Asset } from '../assets/entities/asset.entity';
import { Holding } from '../holdings/entities/holding.entity';
import { User } from '../users/entities/user.entity';
import { CreateMovementDto } from './dto/create-movement.dto';
import { GetMovementsQueryDto } from './dto/get-movements-query.dto';
import { Movement, MovementType } from './entities/movement.entity';

export interface PaginatedMovementsResult {
  data: Movement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    @InjectRepository(Holding)
    private readonly holdingRepository: Repository<Holding>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateMovementDto): Promise<Movement> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${dto.userId} not found`);
    }
    const asset = await this.assetRepository.findOne({
      where: { id: dto.assetId },
    });
    if (!asset) {
      throw new NotFoundException(`Asset with id ${dto.assetId} not found`);
    }

    if (
      (dto.type === MovementType.BUY || dto.type === MovementType.SELL) &&
      (dto.quantity === undefined || dto.quantity === null)
    ) {
      throw new BadRequestException(
        'quantity is required and must be positive for BUY and SELL movements',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const movementRepo = manager.getRepository(Movement);
      const holdingRepo = manager.getRepository(Holding);

      const movement = movementRepo.create({
        user: { id: dto.userId },
        asset: { id: dto.assetId },
        type: dto.type,
        date: dto.date,
        quantity:
          dto.quantity !== undefined && dto.quantity !== null
            ? dto.quantity
            : null,
        price: dto.price,
        total: dto.total,
      });
      await movementRepo.save(movement);

      if (dto.type === MovementType.DIVIDEND) {
        return movementRepo.findOneOrFail({
          where: { id: movement.id },
          relations: ['asset', 'user'],
        });
      }

      const holding = await holdingRepo.findOne({
        where: { user: { id: dto.userId }, asset: { id: dto.assetId } },
      });

      if (dto.type === MovementType.BUY) {
        const buyQty = Number(dto.quantity);
        const buyPrice = Number(dto.price);
        if (!holding) {
          const created = holdingRepo.create({
            user: { id: dto.userId },
            asset: { id: dto.assetId },
            quantity: buyQty,
            avgBuyPrice: buyPrice,
          });
          await holdingRepo.save(created);
        } else {
          const oldQty = Number(holding.quantity);
          const oldAvg = Number(holding.avgBuyPrice);
          const newQty = oldQty + buyQty;
          const newAvg = (oldQty * oldAvg + buyQty * buyPrice) / newQty;
          holding.quantity = newQty;
          holding.avgBuyPrice = newAvg;
          await holdingRepo.save(holding);
        }
      } else if (dto.type === MovementType.SELL) {
        const sellQty = Number(dto.quantity);
        if (!holding) {
          throw new BadRequestException(
            'Cannot sell: no holding for this asset',
          );
        }
        const oldQty = Number(holding.quantity);
        const newQty = oldQty - sellQty;
        if (newQty < 0) {
          throw new BadRequestException(
            `Cannot sell ${sellQty} units: only ${oldQty} available`,
          );
        }
        if (newQty === 0) {
          await holdingRepo.remove(holding);
        } else {
          holding.quantity = newQty;
          await holdingRepo.save(holding);
        }
      }

      return movementRepo.findOneOrFail({
        where: { id: movement.id },
        relations: ['asset', 'user'],
      });
    });
  }

  async findByUser(
    userId: number,
    query: GetMovementsQueryDto,
  ): Promise<PaginatedMovementsResult> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.movementRepository
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.asset', 'asset')
      .where('movement.user_id = :userId', { userId });

    if (query.type !== undefined) {
      qb.andWhere('movement.type = :type', { type: query.type });
    }
    if (query.from !== undefined) {
      qb.andWhere('movement.date >= :from', { from: query.from });
    }
    if (query.to !== undefined) {
      qb.andWhere('movement.date <= :to', { to: query.to });
    }

    qb.orderBy('movement.date', 'DESC').addOrderBy('movement.id', 'DESC');

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}
