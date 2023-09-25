import { Module } from '@nestjs/common';
import { CryptographyModule } from './cryptography';
import { DatabaseModule } from './db';

@Module({
  exports: [CryptographyModule, DatabaseModule],
  imports: [CryptographyModule, DatabaseModule],
})
export class InfraModule {}
