import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { Movement } from './entities/movement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holding } from '../holdings/entities/holding.entity';
import { User } from '../users/entities/user.entity';
import { Asset } from '../assets/entities/asset.entity';
import { HoldingsModule } from '../holdings/holdings.module';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movement, Holding, User, Asset]),
    HoldingsModule,
    AssetsModule,
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
