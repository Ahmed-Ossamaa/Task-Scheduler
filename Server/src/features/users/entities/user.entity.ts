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
  id!: string;

  @Column()
  name!: string;

  @Index('IDX_USERS_EMAIL', { unique: true, where: '"deletedAt" IS NULL' })
  @Column()
  email!: string;

  @Column({ nullable: true, select: false })
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  oAuthProvider?: string | null;

  @Column({ type: 'varchar', nullable: true })
  oauthId?: string | null;

  @Column({ type: 'enum', enum: UserGender, nullable: true })
  gender!: UserGender | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMP,
  })
  role!: UserRole;

  //will be changed later to birthdate : Date | null
  @Column({ nullable: true })
  age!: number;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', nullable: true })
  address!: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatar!: string | null;

  @Index('IDX_USERS_REFRESH_TOKEN')
  @Column({ type: 'text', nullable: true, select: false })
  refreshToken!: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'varchar', nullable: true, select: false })
  verificationToken: string | null = null;

  @Column({ type: 'timestamptz', nullable: true, select: false })
  verificationTokenExpires: Date | null = null;

  @Column({ type: 'varchar', nullable: true, select: false })
  resetPasswordToken: string | null = null;

  @Column({ type: 'timestamptz', nullable: true, select: false })
  resetPasswordExpires: Date | null = null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Index('IDX_USERS_DELETED_AT', { where: '("deletedAt" IS NOT NULL)' })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: Date | null; //partial index on deletedAt (idx is only on the deleted rows)

  @OneToMany(() => Task, (task) => task.assignedTo)
  tasksToDo!: Task[];

  @OneToMany(() => Task, (task) => task.assignedBy)
  tasksAssigned!: Task[];

  @Index('IDX_USERS_ORGANIZATION')
  @Column({ type: 'varchar', nullable: true })
  organizationId!: string | null;

  @ManyToOne(() => Organization, (org) => org.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization | null;
}
