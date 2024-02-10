import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error(exception); // Log the exception

    if (!(exception instanceof HttpException)) {
      response.status(500).json({
        status: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception,
      });

      return;
    }

    const status = exception.getStatus();

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      ...exception,
    });

    return;
  }
}
