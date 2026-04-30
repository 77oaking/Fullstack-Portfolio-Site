import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ResponsePayload } from '@portfolio/shared-types';

/**
 * Global exception filter — every error becomes a `ResponsePayload`.
 *
 * Shape of every error response:
 *   { success: false, message, data?, errorCode? }
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let data: unknown;
    let errorCode: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const b = body as Record<string, unknown>;
        message = (b.message as string) ?? message;
        // class-validator produces { message: string[] } — flatten to array under data
        if (Array.isArray(b.message)) {
          message = 'Validation failed';
          data = { errors: b.message };
        }
        errorCode = (b.errorCode as string) ?? errorCode;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(exception.stack);
    } else {
      this.logger.error(String(exception));
    }

    const payload: ResponsePayload = { success: false, message, data, errorCode };
    res.status(status).json(payload);
  }
}
