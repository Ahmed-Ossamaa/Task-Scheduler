import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource, FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedUsers } from './types/user.responses';
import { Profile } from 'passport-google-oauth20';
import { UserRole } from './enums/user-roles.enum';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Task } from 'src/features/tasks/entities/task.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData);
    return this.saveUser(user);
  }

  async createEmployee(
    managerId: string,
    employeeDto: CreateEmployeeDto,
    hashedPassword: string,
  ): Promise<User> {
    const manager = await this.findUserById(managerId);

    if (!manager.organizationId) {
      throw new BadRequestException(
        'Manager must have an organization in order to create an employee',
      );
    }

    const existing = await this.userRepo.findOneBy({
      email: employeeDto.email,
    });
    if (existing)
      throw new ConflictException('A user with this Email already exists');

    const newEmployee = this.userRepo.create({
      name: employeeDto.name,
      email: employeeDto.email,
      password: hashedPassword,
      role: UserRole.EMP,
      organizationId: manager.organizationId,
      isEmailVerified: true,
    });

    return this.saveUser(newEmployee);
  }

  async findMyEmployees(organizationId: string): Promise<User[]> {
    const employees = await this.userRepo.find({
      where: {
        organizationId,
      },
    });

    return employees;
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findOneBy({ email });
    return user;
  }

  async findUserForLogin(email: string): Promise<User | null> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect([
        'user.password',
        'user.refreshToken',
        'user.role',
        'user.organizationId',
      ])
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }

  async findUserWithRefreshToken(userId: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshToken')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserWithPassword(userId: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAllUsers(
    page: number = 1,
    limit: number = 20,
    select?: FindOptionsSelect<User>,
  ): Promise<PaginatedUsers> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [users, total] = await this.userRepo.findAndCount({
      where: {},
      select: select,
      skip,
      take,
    });
    return {
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  async updateUserPassword(user: User, newPassword: string) {
    user.password = newPassword;
    user.refreshToken = null;
    return this.saveUser(user);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepo.update(userId, { refreshToken });
  }

  async updateUserProfile(
    userId: string,
    profile: Partial<User>,
  ): Promise<User> {
    const user = await this.findUserById(userId);
    Object.assign(user, profile);
    return this.saveUser(user);
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    const user = await this.findUserById(userId);
    user.avatar = avatarUrl;

    return this.saveUser(user);
  }

  async removeAvatar(userId: string): Promise<User> {
    const user = await this.findUserById(userId);
    user.avatar = null;
    return this.saveUser(user);
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //soft delete tasks assigned to the deleted user
      await queryRunner.manager.softDelete(Task, {
        assignedTo: { id: userId },
      });

      //soft delete user
      const result = await queryRunner.manager.softDelete(User, userId);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      await queryRunner.commitTransaction();

      //Later: send an email to the user to notify them that their account has been deleted
      return {
        message: `User with ID ${userId} and his tasks have been deleted successfully`,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

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
      //Soft delete tasks assigned to this employee
      await queryRunner.manager.softDelete(Task, {
        assignedTo: { id: employeeId },
      });

      //Soft delete the Employee
      const result = await queryRunner.manager.softDelete(User, employeeId);

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${employeeId} not found`);
      }

      await queryRunner.commitTransaction();

      //Later: send an emai to the Employee to notify them that their account has been deleted
      return {
        message: `Employee with ID ${employeeId} and his tasks have been deleted successfully`,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Error deleting employee:', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findOrCreateUserFromGoogle(profile: Profile) {
    if (profile.emails) {
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
  }

  async validateEmployeeInOrg(
    organizationId: string,
    employeeId: string,
  ): Promise<User> {
    const employee = await this.findUserById(employeeId);

    if (!organizationId) {
      throw new ForbiddenException('Manager must belong to an organization');
    }

    if (organizationId !== employee.organizationId) {
      throw new ForbiddenException(
        'You cannot assign tasks to users outside your organization',
      );
    }

    return employee;
  }
}
