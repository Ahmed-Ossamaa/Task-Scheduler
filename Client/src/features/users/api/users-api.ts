import api from '@/lib/api/axios';
import { User } from '@/features/auth/types/user-interface';
import { CreateEmployeeDto, PaginatedUser } from '../types';

export const usersApi = {

  getMyProfile: async()=>{
    const {data}= await api.get<User>('/user/me');
    return data
  },

  /**
   * - Admin/Manager/Emp : Get All Employees in Organization
   * @returns An array of all employees in the organization
   */
  getOrgEmployees: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedUser> => {
    const { data } = await api.get<PaginatedUser>('/user/org-employees', {
      params: { page, limit },
    });
    return data;
  },

  /**
   * - Manager : Create a new employee (register a new employee account in my organization)
   * @returns Newly created employee
   */
  createEmployee: async (payload: CreateEmployeeDto): Promise<User> => {
    const { data } = await api.post<{ message: string; user: User }>(
      'auth/register/employee',
      payload,
    );
    return data.user;
  },

  /**
   * - Manager : Delete an employee and their tasks (Soft Delete)
   * @returns  Success Deletion message on Success
   */
  removeEmployee: async (userId: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(
      `/user/employee/${userId}`,
    );
    return data;
  },

  /**
   * - Manager : Get all employees (Paginated)
   * @returns An object containing employees data[ ] and pagination metadata.
   */
  getArchivedEmployees: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedUser> => {
    const { data } = await api.get<PaginatedUser>('/user/employee/archived', {
      params: { page, limit },
    });
    return data;
  },

  /**
   * - Manager : Restore an employee and their tasks (Soft Deleted)
   * @returns Success Restoration message on Success
   */
  restoreEmployee: async (userId: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>(
      `/user/employee/${userId}/restore`,
    );
    return data;
  },

  /**
   * - Manager : Update an employee's role
   * @returns The updated employee
   */
  updateEmpRole: async (userId: string, role: string): Promise<User> => {
    const { data } = await api.patch(`/user/employee/${userId}/role`, { role });
    return data;
  },

  /**
   * - Edit My profile data ( excluding password, email, avatar )
   * @returns {Promise<User>}  The updated user
   */
  editMyProfile: async (payload: Partial<User>): Promise<User> => {
    const { data } = await api.patch<User>(`/user/me`, payload);
    return data;
  },

  uploadAvatar: async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const { data } = await api.patch<User>('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
},

  //................Admin APIs................

  /**
   * - Admin : Get all users (Paginated)
   * @returns An object containing users data[ ] and pagination metadata.
   */
  getAllUsers: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedUser> => {
    const { data } = await api.get('/user', {
      params: { page, limit },
    });
    return data;
  },

  /**
   * - Admin : Delete a user and their tasks (Soft Delete).
   * @returns Success Deletion message on Success.
   */
  removeUser: async (userId: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/user/${userId}`);
    return data;
  },

  /**
   * - Admin : Get archived (soft deleted) users (Paginated)
   * @returns An object containing users data[ ] and pagination metadata.
   */
  getArchivedUsers: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedUser> => {
    const { data } = await api.get('/user/archived', {
      params: { page, limit },
    });
    return data;
  },

  /**
   * - Admin: Restore a user and their tasks (Soft Deleted)
   * @returns {Promise<{ message: string }>} Success Restoration message on Success
   */
  restoreUser: async (userId: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>(
      `/user/${userId}/restore`,
    );
    return data;
  },
};
