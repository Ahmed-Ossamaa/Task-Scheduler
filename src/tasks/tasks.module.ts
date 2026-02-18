import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UserModule } from 'src/users/users.module';
import { BullModule } from '@nestjs/bullmq';
import { TaskProcessor } from './tasks.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UserModule,
    BullModule.registerQueue({ name: 'tasks' }),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskProcessor],
})
export class TasksModule {}
