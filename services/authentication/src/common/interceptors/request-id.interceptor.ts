import { Metadata } from '@grpc/grpc-js';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToRpc().getContext() as Metadata;
    const metadata = ctx;

    const requestId = uuidv4();
    const correlationId = metadata.get('x-correlation-id')[0] || uuidv4();

    metadata.set('x-request-id', requestId);
    metadata.set('x-correlation-id', correlationId);

    return next.handle();
  }
}
