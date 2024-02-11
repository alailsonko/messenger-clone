import { Module } from '@nestjs/common';
import { CommandHandlers } from './commands/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { DataModule } from 'src/data/data.module';
import { UsersService } from './users.service';
import { DomainModule } from 'src/domain/domain.module';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [CqrsModule, DataModule, DomainModule],
  exports: [UsersService],
  providers: [...CommandHandlers, ...QueryHandlers, UsersService],
})
export class UsersApplicationModule {}
