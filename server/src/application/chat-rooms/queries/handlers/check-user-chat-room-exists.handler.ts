import { QueryHandler } from '@nestjs/cqrs';
import { CheckUserChatRoomExistsQuery } from '../impl';
import { ChatRoomsRepository } from 'src/domain/chatRooms/chat-rooms.repository';
import { LoggerService } from 'src/infra/logger/logger.service';

@QueryHandler(CheckUserChatRoomExistsQuery)
export class CheckUserChatRoomExistsHandler {
  constructor(
    private readonly repository: ChatRoomsRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(CheckUserChatRoomExistsHandler.name);
  }

  async execute(query: CheckUserChatRoomExistsQuery): Promise<{ id: string }> {
    const { userId, recipientId } = query;

    const chatRooms = await this.repository.findAll({
      where: {
        usersChatRooms: {
          some: {
            userId,
          },
        },
        AND: {
          usersChatRooms: {
            some: {
              userId: recipientId,
            },
          },
        },
      },
    });

    this.logger.log('Checking if chat room exists...', {
      chatRooms,
    });

    return chatRooms.length > 0 ? { id: chatRooms[0].id } : null;
  }
}
