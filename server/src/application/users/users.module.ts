import { Module } from '@nestjs/common';
import { CommandHandlers } from './commands/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [CqrsModule, DataModule],
  providers: [...CommandHandlers],
})
export class UsersModule {}
