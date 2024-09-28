import { Module } from '@nestjs/common';
import { UsersApplicationService } from './users.service';
import { CommandHandlers } from './commands/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { DataModule } from 'src/data/data.module';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [CqrsModule, DataModule, InfraModule],
  providers: [UsersApplicationService, ...CommandHandlers],
  exports: [UsersApplicationService],
})
export class UsersApplicationModule {}
