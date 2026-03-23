import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../assets/entities/asset.entity';
import { CreateAssetPriceDto } from './dto/create-asset-price.dto';
import { AssetPrice } from './entities/asset-price.entity';

@Injectable()
export class AssetPricesService {
  constructor(
    @InjectRepository(AssetPrice)
    private readonly assetPriceRepository: Repository<AssetPrice>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async create(dto: CreateAssetPriceDto): Promise<AssetPrice> {
    const asset = await this.assetRepository.findOne({
      where: { id: dto.assetId },
    });
    if (!asset) {
      throw new NotFoundException(`Asset with id ${dto.assetId} not found`);
    }

    await this.assetPriceRepository
      .createQueryBuilder()
      .insert()
      .into(AssetPrice)
      .values({
        asset: { id: dto.assetId },
        date: dto.date,
        closePrice: dto.closePrice,
      })
      .orIgnore()
      .execute();

    const row = await this.assetPriceRepository.findOne({
      where: { asset: { id: dto.assetId }, date: dto.date },
    });
    if (!row) {
      throw new NotFoundException(
        `Could not load asset price for asset ${dto.assetId} on ${dto.date}`,
      );
    }
    return row;
  }

  async findByAsset(assetId: number): Promise<AssetPrice[]> {
    const asset = await this.assetRepository.findOne({
      where: { id: assetId },
    });
    if (!asset) {
      throw new NotFoundException(`Asset with id ${assetId} not found`);
    }
    return this.assetPriceRepository.find({
      where: { asset: { id: assetId } },
      order: { date: 'ASC' },
    });
  }

  async findLatestByAsset(assetId: number): Promise<AssetPrice> {
    const asset = await this.assetRepository.findOne({
      where: { id: assetId },
    });
    if (!asset) {
      throw new NotFoundException(`Asset with id ${assetId} not found`);
    }
    const latest = await this.assetPriceRepository.findOne({
      where: { asset: { id: assetId } },
      order: { date: 'DESC' },
    });
    if (!latest) {
      throw new NotFoundException(`No price data found for asset ${assetId}`);
    }
    return latest;
  }
}
