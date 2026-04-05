import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { tasksApi } from '../api/tasks-api';
import { CreateTaskDto, Task, Tasks, UpdateTaskDto } from '../types';

//............................FETCH TASKS DATA..............................
/**
 * Hook to retrieve the tasks assigned to the current user.
 * @returns {UseQueryResult<Task[]>} - The result of the query.
 * It contains the tasks assigned to the current user and methods to handle the query state.
 */
export const useMyTasks = (options?: { enabled?: boolean }): UseQueryResult<Task[]> => {
  return useQuery({
    queryKey: ['tasks', 'my-tasks'],
    queryFn: tasksApi.getMyTasks,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
};
/**
 * Hook to retrieve the tasks assigned to the current user's organization.
 * @returns The result of the query.
 * It contains the tasks assigned to the current user's organization and methods to handle the query state.
 */
export const useOrgTasks = (
  page: number = 1,
  limit: number = 20,
): UseQueryResult<Tasks> => {
  return useQuery({
    queryKey: ['tasks', 'org', page, limit],
    queryFn: () => tasksApi.getOrgTasks(page, limit),
  });
};

/**
 * Hook to retrieve all tasks.
 * @returns {UseQueryResult<Tasks>} - The result of the query.
 * It contains the tasks and methods to handle the query state.
 * @deprecated (Not used Rn, Maybe Later or i will just remove it as admin doesnt need it after  
 * i have removed the All tasks page for admin)
 */
export const useAllTasks = (
  page: number = 1,
  limit: number = 20,
): UseQueryResult<Tasks> => {
  return useQuery({
    queryKey: ['tasks', 'all', page, limit],
    queryFn: () => tasksApi.getAllTasks(page, limit),
  });
};

export const useUserTasks = (userId: string): UseQueryResult<Task[], Error> => {
  return useQuery({
    queryKey: ['tasks', 'user', userId],
    queryFn: () => tasksApi.getUserTasks(userId),
    enabled: !!userId, // Won't fetch until we actually have a userId
  });
};

//............................MUTATE TASKS DATA..............................

/**
 * Hook to create a new task.
 * @returns The result of the mutation.
 *
 * Will invalidate the 'tasks' query when the task is created successfully.
 */
export const useCreateTask = (): UseMutationResult<
  Task,
  Error,
  CreateTaskDto,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => tasksApi.createTask(data),
    onSuccess: () => {
      // refresh lists
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * Hook to update a task.
 * @returns The result of the mutation.
 *
 * Will invalidate the 'tasks' query when the task is updated successfully.
 */
export const useUpdateTask = (): UseMutationResult<
  Task,
  Error,
  {
    taskId: string;
    data: UpdateTaskDto;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskDto }) =>
      tasksApi.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * Hook to mark a task as done.
 * @returns The result of the mutation.
 */
export const useCompleteTask = (): UseMutationResult<
  Task,
  Error,
  string,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.completeTask,
    onSuccess: () => {
      // Refresh the list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * Hook to delete a task.
 * @returns The result of the mutation.
 *
 * Will invalidate the 'tasks' query when the task is deleted successfully.
 */
export const useDeleteTask = (): UseMutationResult<
  void,
  Error,
  string,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => tasksApi.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * Hook to retrieve all tasks for a project.
 * @returns {UseQueryResult<Task[]>} - The result of the query.
 * It contains the tasks for the given project and methods to handle the query state.
 * Will only fetch the data when a projectId is provided.
 */
export const useProjectTasks = (projectId: string): UseQueryResult<Task[]> => {
  return useQuery({
    queryKey: ['tasks', 'project', projectId],
    queryFn: () => tasksApi.getTasksByProject(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 30,
  });
};
