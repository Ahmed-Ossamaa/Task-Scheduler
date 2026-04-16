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
 */
export const useMyTasks = (options?: {enabled?: boolean;},page: number =1, limit: number =20): UseQueryResult<Tasks> => {
  return useQuery({
    queryKey: ['tasks', 'my-tasks', page, limit],
    queryFn:()=> tasksApi.getMyTasks(page, limit),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
};

/**
 * @deprecated
 * Hook to retrieve the tasks assigned to the current user's organization.
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

/**
 * @deprecated later hook
 * - Hook to retrieve the tasks assigned to a specific user.
 */
export const useUserTasks = (
  userId: string,
  page: number = 1,
  limit: number = 1,
): UseQueryResult<Tasks, Error> => {
  return useQuery({
    queryKey: ['tasks', 'user', userId, page , limit],
    queryFn: () => tasksApi.getUserTasks(userId, page, limit),
    enabled: !!userId,
  });
};

//............................MUTATE TASKS DATA..............................

/**
 * Hook to create a new task.
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
 */
export const useProjectTasks = (projectId: string, page: number =1 , limit: number = 20): UseQueryResult<Tasks> => {
  return useQuery({
    queryKey: ['tasks', 'project', projectId , page , limit],
    queryFn: () => tasksApi.getTasksByProject(projectId, page, limit),
    enabled: !!projectId,
    staleTime: 1000 * 30,
  });
};
