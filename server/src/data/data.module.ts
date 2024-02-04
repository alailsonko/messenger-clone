import { Module } from '@nestjs/common';
import { UsersRepository } from './users/repository/users.repository';
import { InfraModule } from 'src/infra/infra.module';
import { DomainModule } from 'src/domain/domain.module';

@Module({
  imports: [InfraModule, DomainModule],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class DataModule {}
