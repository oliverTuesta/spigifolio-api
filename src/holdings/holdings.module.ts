import { Module } from '@nestjs/common';
import { HoldingsService } from './holdings.service';
import { HoldingsController } from './holdings.controller';
import { Holding } from './entities/holding.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Asset } from '../assets/entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Holding, User, Asset])],
  controllers: [HoldingsController],
  providers: [HoldingsService],
  exports: [TypeOrmModule],
})
export class HoldingsModule {}
