import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';

@Entity('asset_prices')
@Unique(['asset', 'date'])
export class AssetPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Asset, (asset) => asset.prices)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'close_price', type: 'numeric', precision: 12, scale: 4 })
  closePrice: number;
}
