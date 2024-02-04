import { Module } from '@nestjs/common';
import { CommandHandlers } from './commands/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { DataModule } from 'src/data/data.module';
import { UsersService } from './users.service';

@Module({
  imports: [CqrsModule, DataModule],
  exports: [UsersService],
  providers: [...CommandHandlers, UsersService],
})
export class UsersApplicationModule {}
