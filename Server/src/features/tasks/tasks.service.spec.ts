/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Job, Queue } from 'bullmq';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enums/tasks-status.enums';
import { TasksService } from './tasks.service';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;

  let repoMock: jest.Mocked<Repository<Task>>;
  let userServiceMock: any;
  let projectServiceMock: any;
  let queueMock: jest.Mocked<Queue>;

  beforeEach(() => {
    repoMock = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    userServiceMock = {
      validateEmployeeInOrg: jest.fn(),
    };

    projectServiceMock = {
      validateProjectExistsForOrg: jest.fn(),
    };

    queueMock = {
      add: jest.fn(),
    } as any;

    service = new TasksService(
      repoMock,
      queueMock,
      userServiceMock,
      projectServiceMock,
    );

    jest.clearAllMocks();
  });

  /* -------------------handleTaskExpiration ------------------- */
  describe('handleTaskExpiration', () => {
    it('should mark task as OVERDUE and clear jobId', async () => {
      const task = {
        id: 'task-1',
        status: TaskStatus.PENDING,
        jobId: 'job-1',
      } as Task;

      repoMock.findOneBy.mockResolvedValue(task);
      repoMock.save.mockResolvedValue(task);

      await service.handleTaskExpiration('task-1');

      expect(repoMock.save).toHaveBeenCalledWith({
        ...task,
        status: TaskStatus.OVERDUE,
        jobId: null,
      });
    });

    it('should do nothing if task is DONE', async () => {
      const task = {
        id: 'task-1',
        status: TaskStatus.DONE,
        jobId: 'job-1',
      } as Task;

      repoMock.findOneBy.mockResolvedValue(task);

      await service.handleTaskExpiration('task-1');

      expect(repoMock.save).not.toHaveBeenCalled();
    });

    it('should do nothing if task not found', async () => {
      repoMock.findOneBy.mockResolvedValue(null);

      await service.handleTaskExpiration('task-1');

      expect(repoMock.save).not.toHaveBeenCalled();
    });
  });

  /*--------------- scheduleTask -------------------*/
  describe('scheduleTask (Create and Schedule a task)', () => {
    const baseTaskDto: CreateTaskDTO = {
      title: 'Task A',
      deadLine: new Date(Date.now() + 1000 * 60 * 60),
      assignedToId: 'user-2',
      projectId: 'project-1',
    };

    it('should create task and schedule expiration job', async () => {
      const employee = { id: 'user-2' };
      const project = { id: 'project-1' };
      const createdTask = { id: 'task-1' } as Task;

      userServiceMock.validateEmployeeInOrg.mockResolvedValue(employee);
      projectServiceMock.validateProjectExistsForOrg.mockResolvedValue(project);

      repoMock.create.mockReturnValue(createdTask);
      repoMock.save.mockResolvedValue(createdTask);

      queueMock.add.mockResolvedValue({ id: 'job-123' } as Job);

      const result = await service.scheduleTask(
        baseTaskDto,
        'manager-1',
        'org-1',
      );

      expect(repoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          assignedById: 'manager-1',
          assignedToId: employee.id,
          organizationId: 'org-1',
          projectId: project.id,
        }),
      );

      expect(queueMock.add).toHaveBeenCalledWith(
        'EXPIRE_TASK_JOB',
        { taskId: 'task-1' },
        expect.objectContaining({
          delay: expect.any(Number),
        }),
      );

      expect(repoMock.save).toHaveBeenCalledTimes(2);

      expect(result).toBeDefined();
    });

    it('should throw if deadline is not in the future', async () => {
      const dto: CreateTaskDTO = {
        ...baseTaskDto,
        deadLine: new Date(Date.now() - 1000),
      };

      await expect(
        service.scheduleTask(dto, 'manager-1', 'org-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should use validated employee and project ids', async () => {
      userServiceMock.validateEmployeeInOrg.mockResolvedValue({
        id: 'emp-validated',
      });

      projectServiceMock.validateProjectExistsForOrg.mockResolvedValue({
        id: 'proj-validated',
      });

      const createdTask = { id: 'task-1' } as Task;

      repoMock.create.mockReturnValue(createdTask);
      repoMock.save.mockResolvedValue(createdTask);
      queueMock.add.mockResolvedValue({ id: 'job-1' } as Job);

      await service.scheduleTask(baseTaskDto, 'manager-1', 'org-1');

      expect(repoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          assignedToId: 'emp-validated',
          projectId: 'proj-validated',
        }),
      );
    });

    it('should set jobId to null if queue returns no id', async () => {
      userServiceMock.validateEmployeeInOrg.mockResolvedValue({
        id: 'user-2',
      });

      projectServiceMock.validateProjectExistsForOrg.mockResolvedValue({
        id: 'project-1',
      });

      const createdTask = { id: 'task-1' } as Task;

      repoMock.create.mockReturnValue(createdTask);
      repoMock.save.mockResolvedValue(createdTask);

      queueMock.add.mockResolvedValue({} as Job); // no job id

      await service.scheduleTask(baseTaskDto, 'manager-1', 'org-1');

      expect(repoMock.save).toHaveBeenLastCalledWith(
        expect.objectContaining({
          jobId: null,
        }),
      );
    });
  });
});
