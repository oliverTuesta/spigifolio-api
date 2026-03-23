import { Module } from '@nestjs/common';
import { AssetPricesService } from './asset-prices.service';
import { AssetPricesController } from './asset-prices.controller';
import { AssetPrice } from './entities/asset-price.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../assets/entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetPrice, Asset])],
  controllers: [AssetPricesController],
  providers: [AssetPricesService],
  exports: [TypeOrmModule],
})
export class AssetPricesModule {}
