import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Holding } from '../../holdings/entities/holding.entity';
import { Movement } from '../../movements/entities/movement.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Holding, (holding) => holding.user)
  holdings: Holding[];

  @OneToMany(() => Movement, (movement) => movement.user)
  movements: Movement[];
}
