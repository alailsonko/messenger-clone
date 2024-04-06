import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;
  private context?: string;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, ...optionalParams: any[]) {
    this.logger.info(this.formatMessage(message), optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    this.logger.error(this.formatMessage(message), optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    this.logger.warn(this.formatMessage(message), optionalParams);
  }

  debug?(message: string, ...optionalParams: any[]) {
    this.logger.debug(this.formatMessage(message), optionalParams);
  }

  verbose?(message: string, ...optionalParams: any[]) {
    this.logger.verbose(this.formatMessage(message), optionalParams);
  }

  private formatMessage(message: string): string {
    return this.context ? `[${this.context}] ${message}` : message;
  }
}
