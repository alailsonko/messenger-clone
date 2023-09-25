import { Module } from '@nestjs/common';
import { UsersQueryResolver } from './queries';
import { UsersMutationResolver } from './mutations';
import { ApplicationModule } from 'src/application';

@Module({
  imports: [ApplicationModule],
  exports: [UsersQueryResolver, UsersMutationResolver],
  providers: [UsersQueryResolver, UsersMutationResolver],
})
export class UsersPresentationModule {}
