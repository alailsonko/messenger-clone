import { Module } from '@nestjs/common';
import { PresentationModule } from './presentation/presentation.module';
import { LoggerModule } from 'nestjs-pino';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestResponseLoggingInterceptor } from './common/interceptors/request-response-logging.interceptor';
import { ErrorHandlingInterceptor } from './common/interceptors/error-handling.interceptor';

@Module({
  imports: [PresentationModule, LoggerModule.forRoot()],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestResponseLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorHandlingInterceptor,
    },
  ],
})
export class AppModule {}
