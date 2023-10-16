import { Module, forwardRef } from '@nestjs/common';
import { UsersRepository } from './users';
import { InfraModule } from 'src/infra';

@Module({
  imports: [forwardRef(() => InfraModule)],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class RepositoriesModule {}
