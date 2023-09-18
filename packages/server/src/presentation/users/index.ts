import { Module } from '@nestjs/common';
import { UsersQueryResolver } from './queries';
import { UsersMutationResolver } from './mutations';

@Module({
  exports: [UsersQueryResolver, UsersMutationResolver],
  providers: [UsersQueryResolver, UsersMutationResolver],
})
export class UsersPresentationModule {}
