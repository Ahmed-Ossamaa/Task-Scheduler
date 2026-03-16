import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '../enums/tasks-status.enums';
import { TaskPriority } from '../enums/tasks-priority.enums';
import { Project } from '../../projects/entities/project.entity';

@Entity('tasks')
@Index(['status', 'deadLine'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  jobId?: string | null;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.LOW })
  priority: TaskPriority;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({ type: 'timestamptz' })
  deadLine: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  //.....Relations.....

  @Column({ nullable: true })
  assignedById: string;

  @ManyToOne(() => User, (user) => user.tasksAssigned, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'assignedById' })
  assignedBy: User;

  @Column({ nullable: true })
  assignedToId: string;

  @ManyToOne(() => User, (user) => user.tasksToDo, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column()
  organizationId: string;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectId: string;
}
