import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoggerService } from 'src/infra/logger/logger.service';
import { CreateMessageCommand } from './commands/impl';
import { GetMessagesQuery } from './queries/impl';
import { PagedResult } from 'src/common/types/paged-result.type';
import { IMessage } from 'src/domain/messages/message.interface';

@Injectable()
export class MessagesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(MessagesService.name);
  }

  async createChatRoomMessage(
    chatRoomId: string,
    senderId: string,
    data: {
      content: string;
    },
  ) {
    return this.commandBus.execute<CreateMessageCommand, void>(
      new CreateMessageCommand(chatRoomId, senderId, data),
    );
  }

  async getChatRoomMessages(
    chatRoomId: string,
    query: { take: number; skip: number },
  ) {
    return this.queryBus.execute<GetMessagesQuery, PagedResult<IMessage>>(
      new GetMessagesQuery(chatRoomId, query),
    );
  }
}
