import api from '@/lib/api/axios';
import { User } from '@/features/auth/types/user-interface';
import { CreateEmployeeDto, PaginatedUser } from '../types';

export const usersApi = {
  /**
   * Admin/Manager/Emp: Get All Employees in Organization
   * @returns {Promise<User[]>} - An array of all employees in the organization
   */
  getOrgEmployees: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/user/org-employees');
    return data;
  },

  /**
   * Manager: Create a new employee (register a new employee account in my organization)
   * @returns {Promise<User>} - Newly created employee
   */
  createEmployee: async (payload: CreateEmployeeDto): Promise<User> => {
    const { data } = await api.post<{ user: User }>(
      'auth/register/employee',
      payload,
    );
    return data.user;
  },


  /**
   * Manager: Delete an employee and their tasks (Soft Delete)
   * @returns {Promise<{ message: string }>} Success Deletion message on Success
   */
  deleteEmployee: async (userId: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>(
      `/user/employee/${userId}/delete`,
    );
    return data;
  },

  restoreEmployee: async (userId: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>(
      `/user/employee/${userId}/restore`,
    );
    return data;
  },

  /**
   * Manager: Update an employee's role
   * @returns {Promise<User>}  The updated employee
   */
  updateEmpRole: async (userId: string, role: string): Promise<User> => {
    const {data} = await api.patch(`/user/employee/${userId}/role`, {role});
    return data;
  },

  /**
   * Edit My profile data ( excluding password, email, avatar )
   * @returns {Promise<User>}  The updated user
   */
  editMyProfile: async ( payload: User): Promise<User> => {
    const { data } = await api.patch<User>(
      `/user/me`,
      payload,
    );
    return data;
  },


  //................Admin APIs................

  getAllUsers: async (page: number = 1, limit: number = 20): Promise<PaginatedUser> => {
    const { data } = await api.get('/user/all', {
      params: { page, limit },
    });
    return data;
  },

  removeUser: async (userId: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>(`/user/${userId}/delete`); 
    return data;
  },


};
