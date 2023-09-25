import { Module } from '@nestjs/common';
import { PrismaService } from './prisma';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
