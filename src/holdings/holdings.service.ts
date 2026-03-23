import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../assets/entities/asset.entity';
import { User } from '../users/entities/user.entity';
import { CreateHoldingDto } from './dto/create-holding.dto';
import { UpdateHoldingDto } from './dto/update-holding.dto';
import { Holding } from './entities/holding.entity';

@Injectable()
export class HoldingsService {
  constructor(
    @InjectRepository(Holding)
    private readonly holdingRepository: Repository<Holding>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async create(dto: CreateHoldingDto): Promise<Holding> {
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

    const existing = await this.holdingRepository.findOne({
      where: { user: { id: dto.userId }, asset: { id: dto.assetId } },
    });
    if (existing) {
      throw new ConflictException(
        `User ${dto.userId} already has a holding for asset ${dto.assetId}`,
      );
    }

    const holding = this.holdingRepository.create({
      user: { id: dto.userId },
      asset: { id: dto.assetId },
      quantity: dto.quantity,
      avgBuyPrice: dto.avgBuyPrice,
    });
    return this.holdingRepository.save(holding);
  }

  async findByUser(userId: number): Promise<Holding[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return this.holdingRepository.find({
      where: { user: { id: userId } },
      relations: ['asset'],
    });
  }

  async update(id: number, dto: UpdateHoldingDto): Promise<Holding> {
    const holding = await this.holdingRepository.findOne({ where: { id } });
    if (!holding) {
      throw new NotFoundException(`Holding with id ${id} not found`);
    }
    if (dto.quantity !== undefined) {
      holding.quantity = dto.quantity;
    }
    if (dto.avgBuyPrice !== undefined) {
      holding.avgBuyPrice = dto.avgBuyPrice;
    }
    return this.holdingRepository.save(holding);
  }

  async remove(id: number): Promise<void> {
    const result = await this.holdingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Holding with id ${id} not found`);
    }
  }
}
