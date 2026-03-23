import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetPrice } from '../asset-prices/entities/asset-price.entity';
import { AssetPricesModule } from '../asset-prices/asset-prices.module';
import { AssetsModule } from '../assets/assets.module';
import { Holding } from '../holdings/entities/holding.entity';
import { HoldingsModule } from '../holdings/holdings.module';
import { User } from '../users/entities/user.entity';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Holding, AssetPrice, User]),
    HoldingsModule,
    AssetsModule,
    AssetPricesModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
