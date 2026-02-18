import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedUsers } from './types/user.responses';



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
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
      .addSelect(['user.password', 'user.refreshToken'])
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
    return this.userRepo.save(user);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepo.update(userId, { refreshToken });
  }

  async updateUserProfile(userId: string, profile: Partial<User>): Promise<User> {
    const user = await this.findUserById(userId);
    Object.assign(user, profile);
    return this.userRepo.save(user);
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userRepo.softDelete(userId);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
}
