import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AssetPricesService } from './asset-prices.service';
import { CreateAssetPriceDto } from './dto/create-asset-price.dto';
import { AssetPrice } from './entities/asset-price.entity';

@Controller('asset-prices')
export class AssetPricesController {
  constructor(private readonly assetPricesService: AssetPricesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAssetPriceDto: CreateAssetPriceDto,
  ): Promise<AssetPrice> {
    return this.assetPricesService.create(createAssetPriceDto);
  }

  @Get(':assetId/latest')
  async findLatestByAsset(
    @Param('assetId', ParseIntPipe) assetId: number,
  ): Promise<AssetPrice> {
    return this.assetPricesService.findLatestByAsset(assetId);
  }

  @Get(':assetId')
  async findByAsset(
    @Param('assetId', ParseIntPipe) assetId: number,
  ): Promise<AssetPrice[]> {
    return this.assetPricesService.findByAsset(assetId);
  }
}
