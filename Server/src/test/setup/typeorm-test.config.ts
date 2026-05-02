import { ActivityLog } from 'src/features/activity/entities/activity-log.entity';
import { ContactMessage } from 'src/features/contact-messages/entities/contact-messages.entity';
import { Organization } from 'src/features/organizations/entities/organization.entity';
import { Project } from 'src/features/projects/entities/project.entity';
import { Task } from 'src/features/tasks/entities/task.entity';
import { User } from 'src/features/users/entities/user.entity';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_TEST_HOST || 'localhost',
  port: Number(process.env.DB_TEST_PORT) || 5434,
  username: process.env.DB_TEST_USER || 'postgres',
  password: process.env.DB_TEST_PASS || 'postgres',
  database: process.env.DB_TEST_NAME || 'task-management-test',

  entities: [Task, Project, User, Organization, ContactMessage, ActivityLog],

  synchronize: true,
  dropSchema: true,
});
