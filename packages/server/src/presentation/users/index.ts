import { Module } from '@nestjs/common';
import { UsersQueryResolver } from './queries';
import { UsersMutationResolver } from './mutations';
import { UsersApplicationModule } from 'src/application/users';

@Module({
  imports: [UsersApplicationModule],
  exports: [UsersQueryResolver, UsersMutationResolver],
  providers: [UsersQueryResolver, UsersMutationResolver],
})
export class UsersPresentationModule {}
