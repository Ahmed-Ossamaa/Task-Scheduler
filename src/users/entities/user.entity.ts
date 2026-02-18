import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-roles.enum';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Index('IDX_USERS_REFRESH_TOKEN')
  @Column({type: 'text', nullable: true, select: false })
  refreshToken?: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Index('IDX_USERS_DELETED_AT', { where: '("deletedAt" IS NOT NULL)' })
  @DeleteDateColumn()
  deletedAt: Date; //partial index on deletedAt (idx is only on the deleted rows)

  @OneToMany(() => Task, (task) => task.author)
  tasks: Task[];
}
