import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = context.switchToRpc().getContext();

    return next.handle().pipe(
      catchError((err) => {
        this.logger.error({ ...err, metadata });

        if (err instanceof RpcException) {
          const errorResponse = err.getError() as {
            code: status;
            message: string;
            metadata?: any;
          };
          return throwError(
            () =>
              new RpcException({
                code: errorResponse.code || status.UNKNOWN,
                message: errorResponse.message || 'An unknown error occurred',
                metadata: errorResponse.metadata ?? metadata,
              }),
          );
        }

        return throwError(
          () =>
            new RpcException({
              code: status.UNKNOWN,
              message: 'An unknown error occurred',
              metadata,
            }),
        );
      }),
    );
  }
}
