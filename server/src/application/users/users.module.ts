import { Module } from '@nestjs/common';
import { CommandHandlers } from './commands/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersService } from './users.service';
import { DomainModule } from 'src/domain/domain.module';
import { QueryHandlers } from './queries/handlers';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [CqrsModule, DomainModule, InfraModule],
  exports: [UsersService],
  providers: [...CommandHandlers, ...QueryHandlers, UsersService],
})
export class UsersApplicationModule {}
