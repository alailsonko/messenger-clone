import { Module } from '@nestjs/common';
import { UsersResolver } from './queries';

@Module({
  exports: [UsersResolver],
  providers: [UsersResolver],
})
export class UsersPresentationModule {}
