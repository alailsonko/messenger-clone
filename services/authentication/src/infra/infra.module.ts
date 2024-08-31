import { Module } from '@nestjs/common';
import { PrismaService } from './database/postgresql/prisma.service';
import { HashService } from './cryptography/hash.service';

@Module({
  providers: [PrismaService, HashService],
  exports: [PrismaService, HashService],
})
export class InfraModule {}
