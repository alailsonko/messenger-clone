import { Module } from '@nestjs/common';
import { UsersEntity } from './users/users.entity';

@Module({
  providers: [UsersEntity],
  exports: [UsersEntity],
})
export class DomainModule {}
