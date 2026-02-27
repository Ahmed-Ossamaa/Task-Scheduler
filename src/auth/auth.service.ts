import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import type { ConfigType } from '@nestjs/config';
import { StringValue } from 'ms';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { UserService } from 'src/users/users.service';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { Profile } from 'passport-google-oauth20';
import { UserRole } from 'src/users/enums/user-roles.enum';
import jwtConfig from 'src/config/jwt.config';
import { AuthResponse } from './interfaces/auth-response.interface';

type Tokens = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<AuthResponse> {
    const existingUser = await this.userService.findUserByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    const tokens = await this.issueTokens(
      newUser.id,
      newUser.email,
      newUser.role,
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
    const tokens = await this.issueTokens(user.id, user.email, user.role);
    return {
      ...tokens,
      user: UserMapper.fromEntity(user),
    };
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
    const tokens = await this.issueTokens(user.id, user.email, user.role);
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
  }

  private async issueTokens(
    userId: string,
    email: string,
    role: UserRole,
  ): Promise<Tokens> {
    const payload = { sub: userId, email, role };

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

  async googleLogin(profile: Profile) {
    const user = await this.userService.findOrCreateUserFromGoogle(profile);
    if (user) {
      const tokens = await this.issueTokens(user.id, user.email, user.role);
      return {
        ...tokens,
        user: UserMapper.fromEntity(user),
      };
    }
  }
}
