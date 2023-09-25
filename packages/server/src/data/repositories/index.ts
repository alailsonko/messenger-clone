import { Module } from '@nestjs/common';
import { UsersRepository } from './users';
import { InfraModule } from 'src/infra';

@Module({
  imports: [InfraModule],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class RepositoriesModule {}
