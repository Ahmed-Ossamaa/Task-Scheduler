/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DataSource } from 'typeorm';
import { ErrorLog } from 'src/features/activity/entities/error-log.entity';
import { AuthenticatedRequest } from './authenticated-request.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  constructor(private readonly dataSource: DataSource) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<AuthenticatedRequest>();

    // Determine Status Code (HTTP error / internal 500)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    //  Extract Error Message
    const rawResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    //get the msg if it is an object or string
    const extracted =
      typeof rawResponse === 'object' && rawResponse !== null
        ? (rawResponse as any).message
        : rawResponse;

    // Flatten validation arrays (from class validator)
    const displayMessage = Array.isArray(extracted) ? extracted[0] : extracted;

    if (status === 500) {
      try {
        const errorLog = new ErrorLog();
        errorLog.statusCode = status;
        errorLog.path = request.url;
        errorLog.method = request.method;

        if (exception instanceof Error) {
          errorLog.errorMessage = exception.message;
          errorLog.stackTrace = exception.stack || null;
        } else {
          errorLog.errorMessage = String(exception);
        }

        // get the id of the user if he is logged in (affected User)
        if (request.user?.sub) {
          errorLog.userId = request.user.sub;
        }

        await this.dataSource.getRepository(ErrorLog).save(errorLog);
      } catch (logError) {
        if (logError instanceof Error) {
          this.logger.error(logError.message, logError.stack);
        } else {
          this.logger.error('Failed to save error log to DB');
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        status === 500
          ? 'An unexpected system error occurred.'
          : displayMessage,
    });
  }
}
