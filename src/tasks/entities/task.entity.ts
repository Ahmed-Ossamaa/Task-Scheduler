import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TaskStatus } from '../enums/tasks-status.enums';
import { TaskPriority } from '../enums/tasks-priority.enums';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable:true})
  jobId?: string

  @Column()
  title: string;

  @Column({nullable:true})
  description?: string;

  @Column({type:'enum',enum:TaskPriority, default: TaskPriority.LOW})
  priority: TaskPriority;

  
  @Column({type:'enum',enum:TaskStatus, default: TaskStatus.PENDING})
  status: TaskStatus

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({type: 'timestamptz'})
  excuteAt: Date

  @ManyToOne(() => User, (author) => author.tasks, {
    onDelete: 'CASCADE',
  })
  author: User;
}

