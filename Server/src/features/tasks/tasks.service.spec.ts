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
      findOne: jest.fn(),
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
      getJob: jest.fn(),
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

  /*--------------- completeTask -------------------*/
  describe('completeTask', () => {
    it('should throw if task not found', async () => {
      repoMock.findOne.mockResolvedValue(null);

      await expect(service.completeTask('task-1', 'user-1')).rejects.toThrow();
    });

    it('should throw if task is OVERDUE', async () => {
      const task = {
        id: 'task-1',
        status: TaskStatus.OVERDUE,
      } as Task;

      repoMock.findOne.mockResolvedValue(task);

      await expect(service.completeTask('task-1', 'user-1')).rejects.toThrow();
    });

    it('should do nothing and return task if already DONE', async () => {
      const task = {
        id: 'task-1',
        status: TaskStatus.DONE,
      } as Task;

      repoMock.findOne.mockResolvedValue(task);

      const result = await service.completeTask('task-1', 'user-1');

      expect(result).toBe(task);
    });

    it('should remove job from queue and mark task as DONE', async () => {
      const removeMock = jest.fn();

      const jobMock = {
        remove: removeMock,
      };

      const task = {
        id: 'task-1',
        status: TaskStatus.PENDING,
        jobId: 'job-1',
      } as Task;
      repoMock.findOne.mockResolvedValue(task);
      //get the job from the queue
      queueMock.getJob = jest.fn().mockResolvedValue(jobMock);
      expect(task.jobId).toBe('job-1'); // job id is there
      repoMock.save.mockResolvedValue(task);

      const result = await service.completeTask('task-1', 'user-1');
      expect(queueMock.getJob).toHaveBeenCalledWith('job-1');

      expect(removeMock).toHaveBeenCalled();
      // expect(task.status).toBe(TaskStatus.DONE);

      expect(repoMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: TaskStatus.DONE,
          jobId: null, // job id is removed
          completedAt: expect.any(Date),
        }),
      );

      expect(result).toBe(task);
    });

    it('should handle and save task (job = null)', async () => {
      const task = {
        id: 'task-1',
        status: TaskStatus.PENDING,
        jobId: 'job-1',
      } as Task;

      repoMock.findOne.mockResolvedValue(task); // found task
      queueMock.getJob = jest.fn().mockResolvedValue(null); // job doesnt exist
      repoMock.save.mockResolvedValue(task); // task is saved succesfully

      await service.completeTask('task-1', 'user-1');

      expect(repoMock.save).toHaveBeenCalledWith({
        ...task,
        status: TaskStatus.DONE,
        jobId: null,
        completedAt: expect.any(Date),
      });
    });
  });

  /*--------------- updateTask -------------------*/
  describe('updateTask', () => {
    const baseTask = {
      id: 'task-1',
      status: TaskStatus.PENDING,
      deadLine: new Date(Date.now() + 100000),
      assignedById: 'manager-1',
    } as Task;

    it('should throw if task not found', async () => {
      repoMock.findOne.mockResolvedValue(null);

      await expect(
        service.updateTask('task-1', {}, 'manager-1'),
      ).rejects.toThrow();
    });

    it('should update task successfully', async () => {
      const task = { ...baseTask };

      repoMock.findOne.mockResolvedValue(task);
      repoMock.save.mockResolvedValue(task);

      jest.spyOn(service as any, 'validateUpdateIsAllowed');
      jest.spyOn(service as any, 'updateCompletedAt');
      jest.spyOn(service as any, 'updateTaskJob').mockResolvedValue(undefined);

      const dto = {
        title: 'Updated Task',
      };

      const result = await service.updateTask('task-1', dto, 'manager-1');

      expect(repoMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Updated Task',
        }),
      );

      expect(result).toBe(task);
    });

    it('should call updateCompletedAt when status is provided', async () => {
      const task = { ...baseTask };

      repoMock.findOne.mockResolvedValue(task);
      repoMock.save.mockResolvedValue(task);

      const updateCompletedAtSpy = jest.spyOn(
        service as any,
        'updateCompletedAt',
      );

      jest.spyOn(service as any, 'updateTaskJob').mockResolvedValue(undefined);

      await service.updateTask(
        'task-1',
        { status: TaskStatus.DONE },
        'manager-1',
      );

      expect(updateCompletedAtSpy).toHaveBeenCalled();
    });

    it('should call updateTaskJob when deadline changes', async () => {
      const task = { ...baseTask };

      repoMock.findOne.mockResolvedValue(task);
      repoMock.save.mockResolvedValue(task);

      const spy = jest
        .spyOn(service as any, 'updateTaskJob')
        .mockResolvedValue(undefined);

      await service.updateTask(
        'task-1',
        { deadLine: new Date(Date.now() + 200000) },
        'manager-1',
      );

      expect(spy).toHaveBeenCalled();
    });

    it('should throw when updating overdue task without status change', async () => {
      const task = {
        ...baseTask,
        status: TaskStatus.OVERDUE,
      };

      repoMock.findOne.mockResolvedValue(task);

      await expect(
        service.updateTask('task-1', { title: 'test' }, 'manager-1'),
      ).rejects.toThrow();
    });
  });
});
