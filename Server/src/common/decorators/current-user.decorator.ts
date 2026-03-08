import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request: Request & { user: JwtPayload } = ctx
      .switchToHttp()
      .getRequest();
    return request.user;
  },
);
