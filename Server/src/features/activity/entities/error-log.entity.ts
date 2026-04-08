import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('error_logs')
export class ErrorLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  statusCode!: number;

  @Column()
  path!: string; //ex: /organizations/create

  @Column()
  method!: string; //ex: POST , GET ...

  @Column({ type: 'text' })
  errorMessage!: string;

  @Column({ type: 'text', nullable: true })
  stackTrace!: string | null;

  @Column({ nullable: true })
  userId!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
