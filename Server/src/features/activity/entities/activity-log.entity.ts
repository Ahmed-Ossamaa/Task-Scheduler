import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ActionType } from '../types/activity-log-types';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActionType })
  actionType: ActionType;

  @Column()
  entityType: string; // 'User', 'Organization', etc..

  @Column()
  entityId: string;

  @Column({ nullable: true })
  details?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
