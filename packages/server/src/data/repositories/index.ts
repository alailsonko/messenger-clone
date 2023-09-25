import { Module } from '@nestjs/common';
import { UsersRepository } from './users';
import { DatabaseModule } from 'src/infra/db';

@Module({
  imports: [DatabaseModule],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class RepositoriesModule {}
