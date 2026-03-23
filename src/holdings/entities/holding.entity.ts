import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Asset } from '../../assets/entities/asset.entity';

@Entity('holdings')
@Unique(['user', 'asset'])
export class Holding {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.holdings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Asset, (asset) => asset.holdings)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ type: 'numeric', precision: 18, scale: 8 })
  quantity: number;

  @Column({ name: 'avg_buy_price', type: 'numeric', precision: 12, scale: 4 })
  avgBuyPrice: number;
}
