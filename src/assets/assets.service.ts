import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

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
    return this.assetRepository.find();
  }

  async findOne(id: number): Promise<Asset> {
    const asset = await this.assetRepository.findOne({ where: { id } });
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
