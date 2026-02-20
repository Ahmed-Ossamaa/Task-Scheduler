/* eslint-disable prettier/prettier */
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { UserService } from 'src/users/users.service';

type Tokens = { accessToken: string; refreshToken: string };
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<Tokens> {
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

    return this.issueTokens(newUser.id, newUser.email);
    //or....................... but needs QueryFailedError & global error handler
    // to prevent race condition (2 users with same email at the same time)
    //     try {
    //   const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    //   const newUser = await this.userService.createUser({
    //     ...registerDto,
    //     password: hashedPassword,
    //   });

    //   return this.issueTokens(newUser.id, newUser.email);
    // } catch (err) {

    // 23505 is just postgres conflict error
    //   if (err.code === '23505') {
    //     throw new BadRequestException('Email already exists');
    //   }
    //   throw err;
    // }
  }

  async login(loginDto: LoginUserDto): Promise<any> {
    const user = await this.userService.findUserForLogin(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matchedPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!matchedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.issueTokens(user.id, user.email);
    return {
      ...tokens,
        data:{
          id: user.id,
          email: user.email,
          role: user.role,
          gender: user.gender,
          avatar: user.avatar,
          isVerified: user.isEmailVerified

        }
    };
  }

  async logout(userId: string): Promise<void> {
    // await this.userRepo.update(userId, { refreshToken: null });
    await this.userService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.findUserWithRefreshToken(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const matchedTokens = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!matchedTokens) {
      throw new ForbiddenException('Access Denied');
    }
    return this.issueTokens(user.id, user.email);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userService.findUserWithPassword(userId);

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

  private async issueTokens(userId: string, email: string): Promise<Tokens> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<StringValue>('JWT_ACCESS_EXPIRES') || '15m',
      }),

      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<StringValue>('JWT_REFRESH_EXPIRES') || '7d',
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
