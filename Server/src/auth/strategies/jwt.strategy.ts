import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ConfigType } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import jwtConfig from 'src/config/jwt.config';
import { UserRole } from 'src/users/enums/user-roles.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.accessSecret,
    });
  }

  validate(payload: Record<string, unknown>): JwtPayload {
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      organizationId: payload.organizationId as string | undefined,
    };
  }
}
