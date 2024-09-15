import { Module } from '@nestjs/common';
import { PermifyModule } from './permify/permify.module';

@Module({
  imports: [PermifyModule],
  exports: [PermifyModule],
})
export class InfraModule {}
