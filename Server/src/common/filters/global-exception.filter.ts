import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DataSource } from 'typeorm';
import { ErrorLog } from 'src/features/activity/entities/error-log.entity';
import { AuthenticatedRequest } from './authenticated-request.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly dataSource: DataSource) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<AuthenticatedRequest>();

    // Nest.js erro || or internal 500
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // the Internal_server_error
    if (status === 500) {
      try {
        const errorLog = new ErrorLog();
        errorLog.statusCode = status;
        errorLog.path = request.url;
        errorLog.method = request.method;

        // Error msg and StackTrace
        if (exception instanceof Error) {
          errorLog.errorMessage = exception.message;
          errorLog.stackTrace = exception.stack || null;
        } else {
          errorLog.errorMessage = String(exception);
        }

        // get the User's ID from JWT
        if (request.user?.sub) {
          errorLog.userId = request.user.sub;
        }

        // Save The log to ErrorLog entity
        await this.dataSource.getRepository(ErrorLog).save(errorLog);
      } catch (logError) {
        console.error('CRITICAL: Failed to save error log to DB', logError);
      }
    }

    // Response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: status === 500 ? 'Unexpected system error occurred.' : message,
    });
  }
}
