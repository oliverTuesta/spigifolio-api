import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Asset } from './entities/asset.entity';
import { AssetPrice } from '../asset-prices/entities/asset-price.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  private get baseQuery() {
    return this.assetRepository.createQueryBuilder('asset').leftJoinAndMapOne(
      'asset.latestPrice',
      AssetPrice,
      'latestPrice',
      `latestPrice.asset_id = asset.id
         AND latestPrice.date = (
           SELECT MAX(ap2.date)
           FROM asset_prices ap2
           WHERE ap2.asset_id = asset.id
         )`,
    );
  }

  async create(dto: CreateAssetDto): Promise<Asset> {
    const existing = await this.assetRepository.findOne({
      where: { ticker: dto.ticker },
    });
    if (existing) {
      throw new ConflictException(
        `Asset with ticker ${dto.ticker} already exists`,
      );
    }
    const asset = this.assetRepository.create(dto);
    return this.assetRepository.save(asset);
  }

  async findAll(): Promise<Asset[]> {
    return this.baseQuery.getMany();
  }

  async findOne(id: number): Promise<Asset> {
    const asset = await this.baseQuery.where('asset.id = :id', { id }).getOne();
    if (!asset) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }
    return asset;
  }

  async remove(id: number): Promise<void> {
    const result = await this.assetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }
  }
}
