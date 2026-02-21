import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-roles.enum';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    const request: Request & { user: JwtPayload } = ctx
      .switchToHttp()
      .getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    const hasRole = requiredRoles.includes(user.role as UserRole);
    if (!hasRole) {
      throw new ForbiddenException(
        `You don't have access to this route: ${request.path}`,
      );
    }

    return true;
  }
}
