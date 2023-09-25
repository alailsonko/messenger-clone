import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CommandHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import { DataModule } from 'src/data';
import { InfraModule } from 'src/infra';

@Module({
  imports: [CqrsModule, DataModule, InfraModule],
  exports: [UsersService],
  providers: [UsersService, ...CommandHandlers],
})
export class UsersApplicationModule {}
