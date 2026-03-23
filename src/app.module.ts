import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AssetPricesModule } from './asset-prices/asset-prices.module';
import { HoldingsModule } from './holdings/holdings.module';
import { MovementsModule } from './movements/movements.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AssetsModule } from './assets/assets.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetPrice } from './asset-prices/entities/asset-price.entity';
import { Asset } from './assets/entities/asset.entity';
import { Holding } from './holdings/entities/holding.entity';
import { Movement } from './movements/entities/movement.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [User, Asset, AssetPrice, Holding, Movement],
        synchronize: true,
      }),
    }),
    AssetsModule,
    AssetPricesModule,
    HoldingsModule,
    MovementsModule,
    PortfolioModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
