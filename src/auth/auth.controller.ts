import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
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
import { CreateEmployeeDto } from 'src/users/dto/create-employee.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-roles.enum';
import jwtConfiguration from 'src/config/jwt.config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
  ) {}
  @Post('register')
  async register(
    @Body() registerDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.registerManager(registerDto);
    this.setRefreshTokenCookie(res, data.refreshToken);
    return {
      accessToken: data.accessToken,
      user: data.user,
    };
  }

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(loginDto);
    this.setRefreshTokenCookie(res, data.refreshToken);
    return {
      accessToken: data.accessToken,
      user: data.user,
    };
  }

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
      user: data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sub);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
    });
    return { message: `${user.email} logged out successfully` };
  }

  @HttpCode(200)
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshTokens(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log('userId', user.sub);
    const refreshToken = req.cookies.refreshToken as string;
    const data = await this.authService.refreshTokens(user.sub, refreshToken);
    this.setRefreshTokenCookie(res, data.refreshToken);
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
      this.setRefreshTokenCookie(res, refreshToken);
      const clientUrl = this.appConfig.clientURL;
      return res.redirect(clientUrl);
    }
  }

  // Helper method =>  set the refresh token cookie to the response
  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    const days: number = parseInt(this.jwtConfig.refreshExpires, 10) || 7;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.appConfig.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: days * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });
  }
}
