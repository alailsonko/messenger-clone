import { Module } from '@nestjs/common';
import { UsersRepository } from './users/repository/users.repository';

@Module({
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class DataModule {}
