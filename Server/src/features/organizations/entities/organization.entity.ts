import { User } from 'src/features/users/entities/user.entity';
import { Project } from 'src/features/projects/entities/project.entity';
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

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index('IDX_ORG_NAME_TRGM', { synchronize: false })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  industry!: string | null;

  @Column({ type: 'varchar', nullable: true })
  slogan!: string | null;

  @Column({ type: 'varchar', nullable: true })
  logo!: string | null;

  @Column({ type: 'varchar', nullable: true })
  cover!: string | null;

  @Column({ type: 'varchar', nullable: true })
  websiteUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  contactEmail!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @OneToMany(() => User, (user) => user.organization)
  users!: User[];

  @OneToMany(() => Project, (project) => project.organization)
  projects!: Project[];
}
