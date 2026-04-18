import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard, RefreshJwtGuard } from './guards/jwt-auth.guard';
import type { Request, Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthResponse } from './interfaces/auth-response.interface';
import appConfiguration from 'src/config/app.config';
import type { ConfigType } from '@nestjs/config';
import { CreateEmployeeDto } from 'src/features/users/dto/create-employee.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/features/users/enums/user-roles.enum';
import jwtConfiguration from 'src/config/jwt.config';
import { Throttle } from '@nestjs/throttler';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
  ) {}

  @ApiOperation({ summary: 'Register new user as a manager' })
  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    const data = await this.authService.registerManager(registerDto);
    return {
      message: data.message,
      user: data.user,
    };
  }

  @ApiOperation({ summary: 'Login user' })
  @Throttle({ default: { limit: 20, ttl: 300000 } })
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(loginDto);
    this.setAuthCookies(res, data.refreshToken);
    return {
      accessToken: data.accessToken,
      user: data.user,
    };
  }

  @ApiOperation({
    summary: 'Register and add new employee to org (Manager only)',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.MANAGER)
  @Post('register/employee')
  async registerEmployee(
    @Body() registerEmpDto: CreateEmployeeDto,
    @CurrentUser() manager: JwtPayload,
  ) {
    const data = await this.authService.registerEmployee(
      manager.sub,
      registerEmpDto,
    );
    return {
      message: data.message,
      user: data.user,
    };
  }

  @ApiOperation({ summary: 'Verify email address using token from email' })
  @HttpCode(200)
  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }
    return await this.authService.verifyEmail(token);
  }

  @ApiOperation({ summary: 'Resend verification email' })
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) //3 per hour
  @HttpCode(200)
  @Post('resend-verification')
  async resendVerification(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    await this.authService.resendVerificationEmail(email);
    return {
      message: 'A new verification link has been sent.',
    };
  }

  @ApiOperation({ summary: 'Logout current user' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sub);

    const clearOptions = {
      secure: this.appConfig.nodeEnv === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    res.clearCookie('refreshToken', { ...clearOptions, httpOnly: true });
    res.clearCookie('hasSession', { ...clearOptions, httpOnly: false });

    return { message: `${user.email} logged out successfully` };
  }

  @ApiOperation({
    summary: 'Change my password (must be logged in) then logout the user',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(user.sub, changePasswordDto);
    return { message: 'Password changed successfully, please login again' };
  }
  @ApiOperation({ summary: 'Send password reset email' })
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Reset password using token from email' })
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: 'Refresh the access token (passive)' })
  @HttpCode(200)
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshTokens(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken as string;
    const data = await this.authService.refreshTokens(user.sub, refreshToken);
    this.setAuthCookies(res, data.refreshToken);
    return {
      accessToken: data.accessToken,
      user: data.user,
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      const { refreshToken } = req.user as AuthResponse;
      this.setAuthCookies(res, refreshToken);
      const clientUrl = this.appConfig.clientURL;
      return res.redirect(clientUrl);
    }
  }

  // Helper method =>  set the refresh token cookie to the response
  private setAuthCookies(res: Response, refreshToken: string) {
    const days: number = parseInt(this.jwtConfig.refreshExpires, 10) || 7;
    const cookieOptions = {
      secure: this.appConfig.nodeEnv === 'production',
      sameSite: 'lax' as const,
      maxAge: days * 24 * 60 * 60 * 1000,
      path: '/',
    };

    //send refreshToken in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      httpOnly: true,
    });

    //send hasSession flag in non-httpOnly cookie
    res.cookie('hasSession', 'true', {
      ...cookieOptions,
      httpOnly: false,
    });
  }
}
