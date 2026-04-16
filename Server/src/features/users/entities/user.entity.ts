import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-roles.enum';
import { Task } from 'src/features/tasks/entities/task.entity';
import { UserGender } from '../enums/user-gender.enum';
import { Organization } from 'src/features/organizations/entities/organization.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index('IDX_USERS_EMAIL', { unique: true, where: '"deletedAt" IS NULL' })
  @Column()
  email: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ nullable: true })
  oAuthProvider?: string;

  @Column({ nullable: true })
  oauthId?: string;

  @Column({ type: 'enum', enum: UserGender, nullable: true })
  gender?: UserGender;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMP,
  })
  role: UserRole;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string | null;

  @Index('IDX_USERS_REFRESH_TOKEN')
  @Column({ type: 'text', nullable: true, select: false })
  refreshToken?: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar', nullable: true, select: false })
  verificationToken: string | null = null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  verificationTokenExpires: Date | null = null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Index('IDX_USERS_DELETED_AT', { where: '("deletedAt" IS NOT NULL)' })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date; //partial index on deletedAt (idx is only on the deleted rows)

  @OneToMany(() => Task, (task) => task.assignedTo)
  tasksToDo: Task[];

  @OneToMany(() => Task, (task) => task.assignedBy)
  tasksAssigned: Task[];

  @Index('IDX_USERS_ORGANIZATION')
  @Column({ nullable: true })
  organizationId: string | null;

  @ManyToOne(() => Organization, (org) => org.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
