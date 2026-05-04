/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserRole } from 'src/features/users/enums/user-roles.enum';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/integrations/mail/mail.interface';

jest.mock('bcrypt');
jest.mock('crypto');

describe('AuthService', () => {
  let service: AuthService;

  let userServiceMock: {
    findUserByEmail: jest.Mock;
    createUser: jest.Mock;
    findByEmailWithFields: jest.Mock;
    findUserByIdWithFields: jest.Mock;
    updateRefreshToken: jest.Mock;
  };

  let jwtServiceMock: {
    sign: jest.Mock;
    signAsync: jest.Mock;
  };

  let mailServiceMock: {
    sendEmail: jest.Mock;
  };

  const jwtConfig = {
    accessSecret: 'access',
    refreshSecret: 'refresh',
    accessExpires: '15m',
    refreshExpires: '7d',
  };

  const appEnv = {
    clientURL: 'http://localhost:3000',
  };

  beforeEach(() => {
    userServiceMock = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
      findByEmailWithFields: jest.fn(),
      findUserByIdWithFields: jest.fn(),
      updateRefreshToken: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn(),
      signAsync: jest.fn(),
    };

    mailServiceMock = {
      sendEmail: jest.fn(),
    };

    service = new AuthService(
      userServiceMock as unknown as UserService,
      jwtServiceMock as unknown as JwtService,
      mailServiceMock as unknown as MailService,
      jwtConfig,
      appEnv as any,
    );

    jest.clearAllMocks();
  });
  /*..................Login............... */
  describe('login', () => {
    it('should throw if user not found', async () => {
      userServiceMock.findByEmailWithFields.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@test.com', password: '123@Bla' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is invalid', async () => {
      userServiceMock.findByEmailWithFields.mockResolvedValue({
        password: 'hashed',
        isEmailVerified: true,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if email not verified', async () => {
      userServiceMock.findByEmailWithFields.mockResolvedValue({
        password: 'hashed',
        isEmailVerified: false,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.login({ email: 'test@test.com', password: '123@Bla' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return tokens on success', async () => {
      userServiceMock.findByEmailWithFields.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: 'hashed',
        role: UserRole.MANAGER,
        organizationId: null,
        isEmailVerified: true,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtServiceMock.signAsync.mockResolvedValue('token');

      const result = await service.login({
        email: 'test@test.com',
        password: '123@Bla',
      });

      expect(result.accessToken).toBe('token');
      expect(result.refreshToken).toBe('token');
      expect(result.user).toBeDefined();
    });
  });

  /*..................Register(Manager)............... */
  describe('register manager', () => {
    const dto = {
      name: 'Ahmed',
      email: 'test@test.com',
      password: '123456',
    };

    it('should throw if user (email) already exists', async () => {
      userServiceMock.findUserByEmail.mockResolvedValue({
        id: '1',
        ...dto,
      });

      await expect(service.registerManager(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userServiceMock.createUser).not.toHaveBeenCalled();
    });

    it('should register manager, hash Pw before saving and send verif. email', async () => {
      userServiceMock.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      (crypto.randomBytes as jest.Mock).mockReturnValue({
        toString: () => 'token-123', //from buffer to string
      });

      const createdUser = {
        id: '1',
        name: dto.name,
        email: dto.email,
      };
      userServiceMock.createUser.mockResolvedValue(createdUser);

      const result = await service.registerManager(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);

      expect(userServiceMock.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          password: 'hashed-password',
          role: UserRole.MANAGER,
          verificationToken: 'token-123',
          isEmailVerified: false,
          organizationId: null,
        }),
      );
      expect(mailServiceMock.sendEmail).toHaveBeenCalled();
      expect(result.user).toBeDefined();
    });

    it('should generate verification token', async () => {
      userServiceMock.findUserByEmail.mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const randomSpy = jest.spyOn(crypto, 'randomBytes').mockReturnValue({
        toString: () => 'verif-token-123',
      } as any);

      userServiceMock.createUser.mockResolvedValue({ id: '1' });

      await service.registerManager(dto);

      expect(randomSpy).toHaveBeenCalledWith(32);
    });
  });
});
