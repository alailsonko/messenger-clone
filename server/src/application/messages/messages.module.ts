import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DomainModule } from 'src/domain/domain.module';
import { InfraModule } from 'src/infra/infra.module';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { MessagesService } from './messages.service';

@Module({
  imports: [CqrsModule, DomainModule, InfraModule],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    MessagesService,
  ],
  exports: [MessagesService],
})
export class MessagesApplicationModule {}
