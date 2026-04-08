import { Request } from 'express';
import { JwtPayload } from 'src/features/auth/interfaces/jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
