import { Module } from '@nestjs/common';
import { UsersPresentationModule } from './users';

@Module({
  exports: [UsersPresentationModule],
  imports: [UsersPresentationModule],
})
export class PresentationModule {}
