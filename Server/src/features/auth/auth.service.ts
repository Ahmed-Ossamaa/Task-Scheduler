import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/features/auth/dto/login-user.dto';
import { RegisterUserDto } from 'src/features/auth/dto/register-user.dto';
import type { ConfigType } from '@nestjs/config';
import { StringValue } from 'ms';
import { ChangePasswordDto } from 'src/features/auth/dto/change-password.dto';
import { UserService } from 'src/features/users/users.service';
import { UserMapper } from 'src/features/users/mappers/user.mapper';
import { Profile } from 'passport-google-oauth20';
import { UserRole } from 'src/features/users/enums/user-roles.enum';
import jwtConfig from 'src/config/jwt.config';
import { AuthResponse } from './interfaces/auth-response.interface';
import { CreateEmployeeDto } from 'src/features/users/dto/create-employee.dto';

type Tokens = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  async registerManager(
    registerManagerDto: RegisterUserDto,
  ): Promise<AuthResponse> {
    const existingUser = await this.userService.findUserByEmail(
      registerManagerDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerManagerDto.password, 10);
    const newUser = await this.userService.createUser({
      ...registerManagerDto,
      password: hashedPassword,
      role: UserRole.MANAGER,
      organizationId: null,
    });

    const tokens = await this.issueTokens(
      newUser.id,
      newUser.email,
      UserRole.MANAGER,
      null,
    );
    return {
      ...tokens,
      user: UserMapper.fromEntity(newUser),
    };
  }

  async login(loginDto: LoginUserDto): Promise<AuthResponse> {
    const user = await this.userService.findUserForLogin(loginDto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matchedPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!matchedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.issueTokens(
      user.id,
      user.email,
      user.role,
      user.organizationId,
    );
    return {
      ...tokens,
      user: UserMapper.fromEntity(user),
    };
  }

  async registerEmployee(managerId: string, registerEmpDto: CreateEmployeeDto) {
    const hashedPassword = await bcrypt.hash(registerEmpDto.password, 10);
    const employee = this.userService.createEmployee(
      managerId,
      registerEmpDto,
      hashedPassword,
    );
    return employee;
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthResponse> {
    const user = await this.userService.findUserWithRefreshToken(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const matchedTokens = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!matchedTokens) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.issueTokens(
      user.id,
      user.email,
      user.role,
      user.organizationId,
    );
    return {
      ...tokens,
      user: UserMapper.fromEntity(user),
    };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userService.findUserWithPassword(userId);

    if (!user.password) {
      throw new BadRequestException(
        'This account was created via an external providers and cannot be changed',
      );
    }
    const isOldPasswordMatching = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isOldPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userService.updateUserPassword(user, hashedPassword);
    await this.logout(user.id);
  }

  async googleLogin(profile: Profile) {
    const user = await this.userService.findOrCreateUserFromGoogle(profile);
    if (user) {
      const organizationId = user.organizationId || null;
      const tokens = await this.issueTokens(
        user.id,
        user.email,
        user.role,
        organizationId,
      );
      return {
        ...tokens,
        user: UserMapper.fromEntity(user),
      };
    }
  }

  private async issueTokens(
    userId: string,
    email: string,
    role: UserRole,
    organizationId: string | null,
  ): Promise<Tokens> {
    const payload = { sub: userId, email, role, organizationId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.accessSecret,
        expiresIn: this.config.accessExpires as StringValue,
      }),

      this.jwtService.signAsync(payload, {
        secret: this.config.refreshSecret,
        expiresIn: this.config.refreshExpires as StringValue,
      }),
    ]);

    await this.storeRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRT = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(userId, hashedRT);
  }
}
