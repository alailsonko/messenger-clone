import { QueryHandler } from '@nestjs/cqrs';
import { GetMessagesQuery } from '../impl';
import { MessagesRepository } from 'src/domain/messages/message.repository';
import { PagedResult } from 'src/common/types/paged-result.type';
import { IMessage } from 'src/domain/messages/message.interface';

@QueryHandler(GetMessagesQuery)
export class GetMessagesHandler {
  constructor(private readonly repository: MessagesRepository) {}

  async execute(query: GetMessagesQuery): Promise<PagedResult<IMessage>> {
    const { chatId, query: messagesQuery } = query;

    const { take, skip } = messagesQuery;

    const messagesPromise = this.repository.findAll({
      skip,
      take,
      where: {
        chatRoomId: chatId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const messagesCountPromise = this.repository.count({
      chatRoomId: chatId,
    });

    const [messages, messagesCount] = await Promise.all([
      messagesPromise,
      messagesCountPromise,
    ]);

    return {
      data: messages,
      count: messagesCount,
    };
  }
}
