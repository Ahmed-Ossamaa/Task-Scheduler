import api from '@/lib/api/axios';
import { CreateTaskDto, Tasks, Task, UpdateTaskDto } from '../types';

export const tasksApi = {
  /**
   * Employee: Get My Tasks (Paginated)
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Number of tasks per page
   * @returns {Promise<Tasks>} - A promise resolving with an array of tasks.
   */
  getMyTasks: async (page: number =1, limit: number =20): Promise<Tasks> => {
    const { data } = await api.get<Tasks>('/tasks/my-tasks', {
      params: { page, limit },
    });
    return data;
  },

  /**
   * Manager & Emp: Get Tasks By Project Id (Paginated)
   * @param {string} projectId - Project ID
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Number of tasks per page
   * @returns {Promise<Tasks>} - A promise resolving with an array of tasks for the given project
   */
  getTasksByProject: async (
    projectId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<Tasks> => {
    const { data } = await api.get<Tasks>(`/tasks/project/${projectId}`, {
      params: { page, limit },
    });
    return data;
  },

  /**
   * Manager: Get Organization Tasks (Paginated)
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Number of tasks per page
   * @returns {Promise<Tasks>} - A promise resolving with an object containing tasks data and pagination metadata.
   */
  getOrgTasks: async (page: number = 1, limit: number = 20): Promise<Tasks> => {
    const { data } = await api.get<Tasks>(`/tasks/org`, {
      params: { page, limit },
    });
    return data;
  },

  /**
   * Admin: Get All Tasks (Paginated)
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Number of tasks per page
   * @returns {Promise<Tasks>} - A promise resolving with an object containing tasks data and pagination metadata.
   */
  getAllTasks: async (page: number = 1, limit: number = 20): Promise<Tasks> => {
    const { data } = await api.get<Tasks>(`/tasks`, {
      params: { page, limit },
    });
    return data;
  },

  /**
   * Manager: Create Task
   * @param {CreateTaskDto} payload - Task data to be created
   * @returns {Promise<Task>} - A promise resolving with the created task data
   */
  createTask: async (payload: CreateTaskDto): Promise<Task> => {
    const { data } = await api.post<Task>('/tasks', payload);
    return data;
  },

  /**
   * Employee: Mark Complete
   * @param {string} taskId - Task ID
   * @returns {Promise<Task>} - A promise resolving with the completed task data
   */
  completeTask: async (taskId: string): Promise<Task> => {
    const { data } = await api.patch<Task>(`/tasks/${taskId}/complete`);
    return data;
  },

  /**
   * Manager: Update Task
   * @param {string} taskId - Task ID
   * @param {UpdateTaskDto} payload - Task data to be updated
   * @returns {Promise<Task>} - A promise resolving with the updated task data
   */
  updateTask: async (taskId: string, payload: UpdateTaskDto): Promise<Task> => {
    const { data } = await api.patch<Task>(`/tasks/${taskId}`, payload);
    return data;
  },

  /**
   * Manager/Admin: Delete a task by its ID.
   * @param {string} taskId - The ID of the task to be deleted.
   * @returns {Promise<void>} - A promise resolving when the task is deleted.
   */
  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },

  /**
   * Admin/Manager: Get Specific User Tasks (Paginated)
   * @param {string} userId - The ID of the user to get tasks for
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Number of tasks per page
   * @returns {Promise<Tasks>} - A promise resolving with an array of tasks for the given user
   */
  getUserTasks: async (
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<Tasks> => {
    const { data } = await api.get<Tasks>(`/tasks/user/${userId}`, {
      params: { page, limit },
    });
    return data;
  },
};
