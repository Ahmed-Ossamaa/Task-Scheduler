import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedUsers } from './types/paginated-users-interface';
import { Profile } from 'passport-google-oauth20';
import { UserRole } from './enums/user-roles.enum';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Task } from 'src/features/tasks/entities/task.entity';
import { GrowthInterval } from '../analytics/types/analytics.types';
import { SensitiveUserFields } from './types/user-sensetive-fields';
import { UserResponseDto } from './dto/user-response.dto';
import { UserMapper } from './mappers/user.mapper';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a new user.
   * @returns The created user.
   */
  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData);
    return this.saveUser(user);
  }

  /**
   * Creates a new employee under a manager.
   * @returns The created employee.
   */
  async createEmployee(
    managerId: string,
    employeeDto: CreateEmployeeDto,
    hashedPassword: string,
    verificationData: {
      verificationToken: string;
      verificationTokenExpires: Date;
      isEmailVerified: boolean;
    },
  ): Promise<User> {
    const manager = await this.findUserById(managerId);

    if (!manager.organizationId) {
      throw new BadRequestException(
        'Manager must have an organization in order to create an employee',
      );
    }

    const newEmployee = this.userRepo.create({
      name: employeeDto.name,
      email: employeeDto.email,
      gender: employeeDto.gender,
      password: hashedPassword,
      role: UserRole.EMP,
      organizationId: manager.organizationId,
      verificationToken: verificationData.verificationToken,
      verificationTokenExpires: verificationData.verificationTokenExpires,
      isEmailVerified: verificationData.isEmailVerified,
    });

    return this.saveUser(newEmployee);
  }

  /**
   * Finds or creates a user from Google profile.
   * @returns The found or created user.
   */
  async findOrCreateUserFromGoogle(profile: Profile) {
    if (!profile.emails || profile.emails.length === 0) {
      throw new BadRequestException(
        'Google profile did not return an email address.',
      );
    }

    const email = profile.emails[0].value;
    const user = await this.findUserByEmail(email);
    if (user) {
      return user;
    }

    return this.createUser({
      email: email,
      name: profile.displayName,
      oAuthProvider: 'google',
      oauthId: profile.id,
      isEmailVerified: true,
      avatar: profile?.photos?.[0].value,
      role: UserRole.MANAGER,
    });
  }

  /**
   * Saves a user to the database.
   * @returns The saved user.
   */
  async saveUser(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  /**
   * Finds a user by their ID.
   * @returns The user if found.
   * @throws NotFoundException if the user is not found.
   */
  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  /**
   * Finds a user by ID.
   * @returns The user with org basic details if found.
   */
  async getUserPorfile(
    targetUserId: string,
    requester?: JwtPayload,
  ): Promise<UserResponseDto> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.organization', 'org')
      .addSelect(['org.id', 'org.name', 'org.logo'])
      .where('user.id = :id', { id: targetUserId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (requester) {
      const isSelf = requester.sub === targetUserId;
      const isSameOrg = requester.organizationId === user.organization?.id;
      const isAdmin = requester.role === UserRole.ADMIN;

      const canAccess = isSelf || isAdmin || isSameOrg;

      if (!canAccess) {
        throw new ForbiddenException('Access denied');
      }
    }
    return UserMapper.fromEntity(user);
  }

  /**
   * Finds a user by their email.
   * @param email The email of the user to find.
   * @param withDeleted Whether to include deleted users in the search.
   * @returns The user if found, otherwise null.
   */
  async findUserByEmail(
    email: string,
    withDeleted: boolean = false,
  ): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { email: email },
      withDeleted,
    });
    return user;
  }

  /**
   * Finds a user by a given field and value.
   * @param field The field to search for (e.g. 'id', 'email', etc.)
   * @param value The value to search for.
   * @returns The user if found, otherwise null.
   */
  async findUserBy(
    field: keyof User,
    value: User[keyof User],
  ): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { [field]: value } });
    return user;
  }

  /**
   * Finds a user by their email and returns specific sensitive fields.
   * @param email The email of the user to find.
   * @param fields The sensitive user fields to return (addSelect).
   * @returns The user if found, otherwise null.
   */
  async findByEmailWithFields(
    email: string,
    fields: SensitiveUserFields[],
  ): Promise<User | null> {
    const qb = this.userRepo.createQueryBuilder('user');

    fields.forEach((field) => {
      qb.addSelect(`user.${field}`);
    });

    return qb.where('user.email = :email', { email }).getOne();
  }

  /**
   * Finds a user by their ID and returns specific sensitive fields.
   * @param userId The ID of the user to find.
   * @param fields The sensitive user fields to return (addSelect).
   * @returns The user if found, otherwise null.
   */
  async findUserByIdWithFields(
    userId: string,
    fields: SensitiveUserFields[],
  ): Promise<User | null> {
    const qb = this.userRepo.createQueryBuilder('user');

    fields.forEach((field) => {
      qb.addSelect(`user.${field}`);
    });

    const user = await qb.where('user.id = :id', { id: userId }).getOne();

    return user;
  }

  /**
   * Finds a user by their verification token.
   * @returns The user if found, otherwise null.
   */
  async findUserByVerificationToken(token: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect([
        'user.verificationToken',
        'user.verificationTokenExpires',
        'user.isEmailVerified',
      ])
      .where('user.verificationToken = :token', { token })
      .getOne();
  }

  /**
   * Finds all users with optional filters and search (Paginated).
   * @param page - Page number (Defaults to 1).
   * @param limit - Number of users per page (Defaults to 20).
   * @returns An object containing the users, total count, page number, and last page number.
   */
  async findAllUsers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: UserRole,
    status?: 'active' | 'banned',
    organizationId?: string,
  ): Promise<PaginatedUsers> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .where('1=1');

    if (search) {
      const formattedSearch = this.formatSearch(search);

      qb.andWhere(
        `(user.search_vector @@ to_tsquery(:search)
        OR user.email ILIKE :email)`,
        {
          search: formattedSearch,
          email: `${search}%`, // prefix (aoss => aossama@gmail.com)
        },
      );

      // ranking (rank results by relevance)
      qb.addSelect(
        `ts_rank(user.search_vector, to_tsquery(:search))`,
        'user_rank',
      );
      qb.addOrderBy('user_rank', 'DESC');
    }

    // Filters
    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    if (status) {
      const isActive = status === 'active';
      qb.andWhere('user.isActive  = :isActive', { isActive });
    }

    if (organizationId) {
      qb.andWhere('user.organizationId = :organizationId', { organizationId });
    }
    qb.addOrderBy('user.createdAt', 'DESC');
    qb.skip(skip).take(take);

    const [users, total] = await qb.getManyAndCount();

    return {
      data: users.map(UserMapper.fromEntity),
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  /**
   * Finds all users in a specific organization with optional filters and search (Paginated).
   * @returns An object containing the users, total count, page number, and last page number.
   */
  async findMyTeam(
    organizationId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
  ): Promise<PaginatedUsers> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .where('organization.id = :organizationId', { organizationId });

    if (search) {
      const formattedSearch = this.formatSearch(search);

      qb.andWhere(
        `(user.search_vector @@ to_tsquery(:search)
        OR user.email ILIKE :email)`,
        {
          search: formattedSearch,
          email: `${search}%`, // prefix (aoss => aossama@gmail.com)
        },
      );
      // ranking (rank results by relevance)
      qb.addSelect(
        `ts_rank(user.search_vector, to_tsquery(:search))`,
        'user_rank',
      );
      qb.addOrderBy('user_rank', 'DESC');
    }

    qb.addOrderBy('user.createdAt', 'DESC');
    qb.skip(skip).take(take);

    const [employees, total] = await qb.getManyAndCount();

    return {
      data: employees.map(UserMapper.fromEntity),
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  /**
   * Updates the profile of a user.
   * @returns The updated user.
   */
  async updateUserProfile(
    userId: string,
    profile: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findUserById(userId);
    Object.assign(user, profile);
    // Update search vector
    if (profile.name) {
      user.search_vector = `${user.name ?? ''} ${user.email ?? ''}`.trim();
    }
    const saved = await this.saveUser(user);
    return UserMapper.fromEntity(saved);
  }

  /**
   * Updates the password of a user.
   * @returns The updated user.
   */
  async updateUserPassword(
    user: User,
    newPassword: string,
  ): Promise<UserResponseDto> {
    user.password = newPassword;
    user.refreshToken = null;
    const updated = await this.saveUser(user);
    return UserMapper.fromEntity(updated);
  }

  /**
   * Updates the refresh token of a user.
   */
  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepo.update(userId, { refreshToken });
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    const result = await this.userRepo.update(userId, { isActive });

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  /**
   * Updates the avatar of a user (adding the url in db not uploading the file).
   * @returns The updated user.
   */
  async updateAvatar(
    userId: string,
    avatarUrl: string,
  ): Promise<UserResponseDto> {
    const user = await this.findUserById(userId);
    user.avatar = avatarUrl;
    const updated = await this.saveUser(user);

    return UserMapper.fromEntity(updated);
  }

  /**
   * Removes the avatar from a user.
   * @returns The updated user.
   */
  async removeAvatar(userId: string): Promise<UserResponseDto> {
    const user = await this.findUserById(userId);
    user.avatar = null;
    const updated = await this.saveUser(user);
    return UserMapper.fromEntity(updated);
  }

  /**
   * Updates the role of an employee in an organization.
   * @returns The updated employee.
   */
  async updateEmployeeRole(
    orgId: string,
    employeeId: string,
    newRole: UserRole.MANAGER | UserRole.EMP,
  ) {
    const employee = await this.userRepo.findOne({
      where: {
        id: employeeId,
        organizationId: orgId,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee not found in your organization.`);
    }

    employee.role = newRole;

    const updated = await this.saveUser(employee);
    return UserMapper.fromEntity(updated);
  }

  /**
   * Updates the verification token when a user requests a "Resend Link".
   */
  async updateVerificationToken(
    userId: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.userRepo.update(userId, {
      verificationToken: token,
      verificationTokenExpires: expires,
      isEmailVerified: false,
    });
  }

  /**
   * Marks a user's email as verified and wipes the tokens.
   */
  async markEmailAsVerified(userId: string): Promise<void> {
    await this.userRepo.update(userId, {
      isEmailVerified: true,
      verificationToken: null, // Wipe the token so it cant be reused
      verificationTokenExpires: null,
    });
  }

  /**
   * Hard Deletes any user (without cascading)
   * - tasks assigned to this user will not be deleted'.
   * - should be used by Admins only
   * @returns Success Deletion message on Success.
   */
  async hardDeleteUser(userId: string): Promise<void> {
    const result = await this.userRepo.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  /**
   * Soft Deletes any user and their associated tasks.
   * should be used by Admins only
   * @returns Success Deletion message on Success.
   */
  async softDeleteUser(userId: string): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      //soft delete tasks assigned to the deleted user
      await queryRunner.manager.softDelete(Task, {
        assignedTo: { id: userId },
      });

      //soft delete user
      await queryRunner.manager.softRemove(user);

      await queryRunner.commitTransaction();

      //Later: send an email to the user to notify them that their account has been deleted
      return {
        message: `User with ID ${userId} and his tasks have been suspended successfully`,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'Failed to delete user',
        err instanceof Error ? err.stack : err,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Restores a user and their tasks (Admin only).
   * @returns  Success restoration message on Success.
   */
  async restoreUser(userId: string): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        withDeleted: true,
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      if (!user.deletedAt) {
        throw new BadRequestException('This user is not deleted.');
      }
      //soft delete tasks assigned to the deleted user
      await queryRunner.manager.restore(Task, {
        assignedTo: { id: userId },
      });

      //soft delete user
      await queryRunner.manager.recover(user);

      await queryRunner.commitTransaction();

      //Later: send an email to the user to notify them that their account has been restored
      return {
        message: `User with ID ${userId} and his tasks have been restored successfully`,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'Failed to restore user',
        err instanceof Error ? err.stack : err,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Delete an employee and all associated tasks (Soft Delete).
   * Only accessible to a manager of the employee's organization.
   * @returns  Success Deletion message on Success.
   */
  async deleteEmployee(
    managerOrgId: string,
    employeeId: string,
  ): Promise<{ message: string }> {
    const employee = await this.findUserById(employeeId);
    if (employee.organizationId !== managerOrgId) {
      throw new ForbiddenException(
        'You can only manage users in your own organization',
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const emp = await queryRunner.manager.findOne(User, {
        where: { id: employeeId },
      });

      if (!emp) {
        throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      }

      //Soft delete tasks assigned to this employee
      await queryRunner.manager.softDelete(Task, {
        assignedTo: { id: employeeId },
      });

      //Soft delete the Employee
      await queryRunner.manager.softRemove(emp);

      await queryRunner.commitTransaction();

      //Later: send an emai to the Employee to notify them that their account has been deleted
      return {
        message: `Employee with ID ${employeeId} and his tasks have been suspended successfully`,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'Failed to delete employee',
        err instanceof Error ? err.stack : err,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Restore an employee and their tasks (Manager only).
   * @returns  Success restoration message on Success.
   */
  async restoreEmployee(
    employeeId: string,
    managerOrgId: string,
  ): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // find the employee even if its deleted, ensuring they belong to this manager org

    try {
      const employee = await queryRunner.manager.findOne(User, {
        where: { id: employeeId, organizationId: managerOrgId },
        withDeleted: true,
      });
      if (!employee) {
        throw new NotFoundException(`Employee not found in your organization.`);
      }
      if (!employee.deletedAt) {
        throw new BadRequestException('This employee is not deleted.');
      }

      //Restore the tasks (doesnt trigger subscribers)
      await queryRunner.manager.restore(Task, {
        assignedTo: { id: employeeId },
      });

      //Recover User (triggers Subscriber!)
      await queryRunner.manager.recover(employee);

      await queryRunner.commitTransaction();

      return { message: `Employee restored successfully.` };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'Error restoring employee: ',
        err instanceof Error ? err.stack : err,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get all  soft deleted users (Paginated)
   */
  async getDeletedUsers(page = 1, limit = 20): Promise<PaginatedUsers> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [users, total] = await this.userRepo.findAndCount({
      where: {
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
      relations: ['organization'],
      order: {
        deletedAt: 'DESC',
      },
      skip,
      take,
    });

    return {
      data: users.map(UserMapper.fromEntity),
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  /**
   * Get all  soft deleted employees in an organization (Paginated)
   */
  async getDeletedEmployees(
    orgId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedUsers> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [employees, total] = await this.userRepo.findAndCount({
      where: {
        organizationId: orgId,
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
      order: {
        deletedAt: 'DESC',
      },
      skip,
      take,
    });

    return {
      data: employees.map(UserMapper.fromEntity),
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  /**
   * Get the number of users (system wide)
   */
  async getUsersCount() {
    return this.userRepo.count();
  }

  /**
   * Returns the distribution of roles within the organization.
   * An array of objects with the role and its count.
   * - Example: [{ role: 'admin', count: 2 }, { role: 'manager', count: 4 }, { role: 'employee', count: 10 }]
   */
  async getRoleDistribution(): Promise<{ role: UserRole; count: number }[]> {
    return this.userRepo
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(user.id)::int', 'count')
      .groupBy('user.role')
      .getRawMany<{ role: UserRole; count: number }>();
  }

  /**
   * Returns the growth of users within the organization for the given interval.
   * An array of objects with the month and its count.
   * - Example: [{ month: 2026-01, users: 2 }, { month: 2026-02, users: 4 }, { month: 2026-03, users: 10 }]
   *
   * @param {GrowthInterval} interval - The interval for which to retrieve the user growth.
   * @returns {Promise<{ month: Date; users: number }[]>}
   */
  async getUserGrowth(
    interval: GrowthInterval = GrowthInterval.SIX_MONTHS,
  ): Promise<{ month: Date; users: number }[]> {
    const result = await this.userRepo
      .createQueryBuilder('u')
      .select(`DATE_TRUNC('month', u."createdAt")`, 'month')
      .addSelect(`COUNT(u.id)::int`, 'users')
      .where(`u."createdAt" >= NOW() - CAST(:interval AS INTERVAL)`, {
        interval,
      })
      .groupBy(`DATE_TRUNC('month', u."createdAt")`)
      .orderBy(`DATE_TRUNC('month', u."createdAt")`, 'ASC')
      .getRawMany<{ month: Date; users: number }>();

    return result;
  }

  /**
   * Validate that an employee is part of the same organization as the manager.
   * @param organizationId - The ID of the manager's organization.
   * @param employeeId - The ID of the employee to be validated.
   * @returns The validated employee.
   * @throws {ForbiddenException} - If the employee is not part of the manager's organization.
   */
  async validateEmployeeInOrg(
    organizationId: string,
    employeeId: string,
  ): Promise<User> {
    const employee = await this.findUserById(employeeId);

    if (!organizationId) {
      throw new ForbiddenException('Manager must belong to an organization');
    }

    if (organizationId !== employee.organizationId) {
      throw new ForbiddenException('You are not part of this organization');
    }

    return employee;
  }

  /**
   * Format a search query to include wildcards for each word.
   * @param search - The search query to format.
   * @returns The formatted search query.
   */
  private formatSearch(search: string): string {
    const words = search.trim().split(/\s+/).filter(Boolean);

    return words.map((word) => `${word}:*`).join(' & ');
  }
}
