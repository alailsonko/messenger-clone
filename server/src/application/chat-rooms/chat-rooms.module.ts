import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DomainModule } from 'src/domain/domain.module';
import { InfraModule } from 'src/infra/infra.module';
import { ChatRoomsService } from './chat-rooms.service';
import { CommandHandlers } from './commands/handlers';

@Module({
  imports: [CqrsModule, DomainModule, InfraModule],
  providers: [...CommandHandlers, ChatRoomsService],
  exports: [ChatRoomsService],
})
export class ChatRoomsApplicationModule {}
