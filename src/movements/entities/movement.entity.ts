import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Asset } from '../../assets/entities/asset.entity';

export enum MovementType {
  BUY = 'BUY',
  SELL = 'SELL',
  DIVIDEND = 'DIVIDEND',
}

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Asset, (asset) => asset.movements)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  quantity: number | null;

  @Column({ type: 'numeric', precision: 12, scale: 4 })
  price: number;

  @Column({ type: 'numeric', precision: 14, scale: 4 })
  total: number;
}
