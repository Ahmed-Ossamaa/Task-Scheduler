import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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
import { MailService } from 'src/integrations/mail/mail.interface';
import { User } from '../users/entities/user.entity';
import appConfig from 'src/config/app.config';
import {
  employeeInviteTemplate,
  managerWelcomeTemplate,
  resendVerificationTemplate,
} from 'src/integrations/mail/mail.temp';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

type Tokens = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    @Inject(appConfig.KEY)
    private readonly appEnv: ConfigType<typeof appConfig>,
  ) {}

  async registerManager(registerManagerDto: RegisterUserDto) {
    const existingUser = await this.userService.findUserByEmail(
      registerManagerDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerManagerDto.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // 24h
    const newUser = await this.userService.createUser({
      ...registerManagerDto,
      password: hashedPassword,
      role: UserRole.MANAGER,
      organizationId: null,
      verificationToken,
      verificationTokenExpires: tokenExpires,
      isEmailVerified: false,
    });
    const frontendUrl = this.appEnv.clientURL;
    this.sendManagerWelcomeEmail(newUser, verificationToken, frontendUrl);

    return {
      message:
        'User registered successfully, please check your email to verify your account',
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
    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Please verify your email before logging in.',
      );
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
    // Generate token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // 24h
    const employee = await this.userService.createEmployee(
      managerId,
      registerEmpDto,
      hashedPassword,
      {
        verificationToken,
        verificationTokenExpires: tokenExpires,
        isEmailVerified: false,
      },
    );
    const frontendUrl = this.appEnv.clientURL;
    this.sendEmployeeInviteEmail(
      employee,
      verificationToken,
      registerEmpDto.password,
      frontendUrl,
    );
    return {
      message:
        'Employee registered successfully, please ask the user to check their email to verify thier account',
      user: UserMapper.fromEntity(employee),
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findUserForLogin(
      forgotPasswordDto.email,
    );

    if (!user) {
      return { message: 'A reset link has been sent, Please check your email' };
    }

    // reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // expiration (1h)
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiration;
    await this.userService.saveUser(user);

    // Send email
    const resetLink = `${this.appEnv.clientURL}/reset-password?token=${resetToken}`;
    await this.mailService.sendEmail(
      user.email,
      user.name,
      'reset password',
      resetLink,
    );

    return { message: 'A reset link has been sent, Please check your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findUserBy(
      'resetPasswordToken',
      resetPasswordDto.token,
    );

    if (
      !user ||
      (user.resetPasswordExpires && user.resetPasswordExpires < new Date())
    ) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    // Hashed newPassword
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    //Update password
    user.password = hashedPassword;
    // nullish the  tokens
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userService.saveUser(user);

    return {
      message: 'Password has been successfully reset. You can now log in.',
    };
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

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userService.findUserByVerificationToken(token);

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    if (
      user.verificationTokenExpires &&
      user.verificationTokenExpires < new Date()
    ) {
      throw new BadRequestException(
        'Verification token has expired. Please request a new one.',
      );
    }

    //mark email as verified
    await this.userService.markEmailAsVerified(user.id);

    return { message: 'Email successfully verified. You can now log in.' };
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) return;

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24);

    await this.userService.updateVerificationToken(
      user.id,
      verificationToken,
      tokenExpires,
    );

    const frontendUrl = this.appEnv.clientURL;

    //send email to user (manager or employee)
    if (user.role === UserRole.MANAGER) {
      this.sendManagerWelcomeEmail(user, verificationToken, frontendUrl);
    } else {
      this.resendEmailVerification(user, verificationToken, frontendUrl);
    }
  }

  // Helper methods (tokens)

  /**
   * Issues a new access and refresh tokens
   */
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

  /**
   * Store the refresh token in the database (hashed)
   */
  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRT = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(userId, hashedRT);
  }

  // Helper methods (emails)

  /**
   * Sends a welcome email to a manager
   */
  private sendManagerWelcomeEmail(
    user: User,
    token: string,
    frontendUrl: string,
  ) {
    const verifyLink = `${frontendUrl}/verify-email?token=${token}`;
    const html = managerWelcomeTemplate(user.name, verifyLink);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.mailService.sendEmail(
      user.email,
      user.name,
      'Verify your account',
      html,
    );
  }

  /**
   * Sends an email to an employee with an invitation to join the organization workspace.
   * The email includes a temporary password and a link to verify their email address.
   */
  private sendEmployeeInviteEmail(
    user: User,
    token: string,
    tempPass: string,
    frontendUrl: string,
  ) {
    const verifyLink = `${frontendUrl}/verify-email?token=${token}`;
    const html = employeeInviteTemplate(user.name, tempPass, verifyLink);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.mailService.sendEmail(user.email, user.name, 'You are invited!', html);
  }

  /**
   * Resends an email verification link to the user.
   */
  private resendEmailVerification(
    user: User,
    token: string,
    frontendUrl: string,
  ) {
    const verifyLink = `${frontendUrl}/verify-email?token=${token}`;
    const html = resendVerificationTemplate(user.name, verifyLink);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.mailService.sendEmail(
      user.email,
      user.name,
      'Verify your email address',
      html,
    );
  }
}
