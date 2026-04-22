import { MessageStatus } from 'src/features/contact-messages/interfaces/message-status-enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

@Index(['status', 'createdAt'])
@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  subject!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.UNREAD,
  })
  @Index()
  status!: MessageStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  @Index()
  createdAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
