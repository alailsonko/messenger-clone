import { Module } from '@nestjs/common';
import { UsersPresentationModule } from './users';

@Module({
  imports: [UsersPresentationModule],
  exports: [UsersPresentationModule],
})
export class PresentationModule {}
