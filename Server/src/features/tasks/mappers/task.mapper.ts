import { TaskResponseDto } from '../dto/tasks-response.dto';
import { Task } from '../entities/task.entity';

export class TaskMapper {
  static fromEntity(this: void, task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      deadLine: task.deadLine,
      completedAt: task.completedAt ?? null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      assignedToId: task.assignedToId,
      assignedById: task.assignedById,
      projectId: task.projectId,
      organizationId: task.organizationId,

      project: task.project
        ? {
            id: task.project.id,
            name: task.project.name,
          }
        : null,

      assignedTo: task.assignedTo
        ? {
            id: task.assignedTo.id,
            name: task.assignedTo.name,
          }
        : null,

      assignedBy: task.assignedBy
        ? {
            id: task.assignedBy.id,
            name: task.assignedBy.name,
          }
        : null,
    };
  }
}
