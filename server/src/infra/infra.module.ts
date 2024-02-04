import { Module } from '@nestjs/common';
import { PrismaService } from './db/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class InfraModule {}
