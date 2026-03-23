import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AssetPrice } from '../../asset-prices/entities/asset-price.entity';
import { Holding } from '../../holdings/entities/holding.entity';
import { Movement } from '../../movements/entities/movement.entity';

export enum AssetType {
  STOCK = 'STOCK',
  ETF = 'ETF',
  BOND = 'BOND',
  CRYPTO = 'CRYPTO',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, unique: true })
  ticker: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: AssetType })
  type: AssetType;

  @OneToMany(() => AssetPrice, (price) => price.asset)
  prices: AssetPrice[];

  @OneToMany(() => Holding, (holding) => holding.asset)
  holdings: Holding[];

  @OneToMany(() => Movement, (movement) => movement.asset)
  movements: Movement[];
}
