import { Module } from '@nestjs/common';
import { PresentationModule } from './presentation/presentation.module';
import { LoggerModule } from 'nestjs-pino';
import { RequestIdInterceptor, RequestResponseLoggingInterceptor, ErrorHandlingInterceptor } from '@messenger-clone/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
