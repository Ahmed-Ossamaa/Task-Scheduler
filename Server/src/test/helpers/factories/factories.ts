import { ContactMessage } from 'src/features/contact-messages/entities/contact-messages.entity';
import { MessageStatus } from 'src/features/contact-messages/interfaces/message-status-enum';
import { Organization } from 'src/features/organizations/entities/organization.entity';
import { Project } from 'src/features/projects/entities/project.entity';
import { Task } from 'src/features/tasks/entities/task.entity';
import { TaskPriority } from 'src/features/tasks/enums/tasks-priority.enums';
import { TaskStatus } from 'src/features/tasks/enums/tasks-status.enums';
import { User } from 'src/features/users/entities/user.entity';
import { UserRole } from 'src/features/users/enums/user-roles.enum';
import { DeepPartial } from 'typeorm';

/**
 * A blueprint for creating test data for every entity
 *
 * -It fills out the required base fields
 *
 * @param overrides - any other  fields - to be passed by the caller
 * (usually the runSoftDeleteCleanupTest function )
 *
 * @returns A partial Entity object.
 */

/* ---------------- ORGANIZATION ---------------- */
export const organizationFactory = (
  overrides?: DeepPartial<Organization>,
): DeepPartial<Organization> => ({
  name: 'test org',
  ...overrides,
});

/* ---------------- PROJECT ---------------- */
export const projectFactory = (
  overrides?: DeepPartial<Project>,
): DeepPartial<Project> => ({
  name: 'test project',
  description: 'test desc',
  ...overrides,
});

/* ---------------- TASK ---------------- */
export const taskFactory = (
  overrides?: DeepPartial<Task>,
): DeepPartial<Task> => ({
  title: 'test task',
  deadLine: new Date(),
  status: TaskStatus.PENDING,
  priority: TaskPriority.LOW,
  ...overrides,
});

/* ---------------- USER ---------------- */
export const userFactory = (
  overrides?: DeepPartial<User>,
): DeepPartial<User> => ({
  name: 'test user',
  email: 'test@test.com',
  role: UserRole.EMP,
  isActive: true,
  isEmailVerified: false,
  ...overrides,
});

/* ---------------- CONTACT MESSAGE ---------------- */
export const contactMessageFactory = (
  overrides?: DeepPartial<ContactMessage>,
): DeepPartial<ContactMessage> => ({
  name: 'test msg',
  email: 'test@test.com',
  subject: 'test subject',
  message: 'test message',
  status: MessageStatus.UNREAD,
  ...overrides,
});
