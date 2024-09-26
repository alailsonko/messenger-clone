import { Metadata } from '@grpc/grpc-js';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestResponseLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToRpc().getContext() as Metadata;
    const data = context.switchToRpc().getData();

    const metadata = ctx.getMap();

    const handler = context.getHandler();
    const className = context.getClass().name;
    const handlerName = handler.name;

    this.logger.info({
      message: 'Received request',
      className,
      handlerName,
      data,
      metadata,
    });

    return next.handle().pipe(
      tap((response) => {
        this.logger.info({
          message: 'Sending response',
          className,
          handlerName,
          response,
          metadata,
        });
      }),
    );
  }
}
