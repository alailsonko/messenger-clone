import { Module } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [InfraModule],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class DataModule {}
