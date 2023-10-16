import { Module } from '@nestjs/common';
import { CryptographyModule } from './cryptography';
import { DatabaseModule } from './db';
import { AuthModule } from './auth';

@Module({
  exports: [CryptographyModule, DatabaseModule, AuthModule],
  imports: [CryptographyModule, DatabaseModule, AuthModule],
})
export class InfraModule {}
