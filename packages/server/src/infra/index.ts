import { Module } from '@nestjs/common';
import { DatabaseModule } from './db';
import { CryptographyModule } from './cryptography';

@Module({
  exports: [DatabaseModule, CryptographyModule],
  imports: [DatabaseModule, CryptographyModule],
})
export class InfraModule {}
