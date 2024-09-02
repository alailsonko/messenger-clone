import { Module } from '@nestjs/common';
import { PrismaService } from './database/postgresql/prisma.service';
import { HashService } from './cryptography/hash.service';
import { EncryptDecryptService } from './cryptography/encrypt-decrypt.service';

@Module({
  providers: [PrismaService, HashService, EncryptDecryptService],
  exports: [PrismaService, HashService, EncryptDecryptService],
})
export class InfraModule {}
