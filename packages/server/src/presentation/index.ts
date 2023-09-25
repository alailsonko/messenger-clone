import { Module } from '@nestjs/common';
import { UsersPresentationModule } from './users';

@Module({
  exports: [UsersPresentationModule],
})
export class PresentationModule {}
