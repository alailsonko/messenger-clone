import { QueryHandler } from '@nestjs/cqrs';
import { GetUserChatRoomQuery } from '../impl';
import { ChatRoomsRepository } from 'src/domain/chatRooms/chat-rooms.repository';
import { LoggerService } from 'src/infra/logger/logger.service';
import { IChatRoom } from 'src/domain/chatRooms/chat-rooms.interface';

@QueryHandler(GetUserChatRoomQuery)
export class GetUserChatRoomHandler {
  constructor(
    private readonly repository: ChatRoomsRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(query: GetUserChatRoomQuery): Promise<IChatRoom> {
    const { userId, chatRoomId } = query;

    this.logger.log('Getting user chat room...', {
      userId,
      chatRoomId,
    });

    const userChatRoom = await this.repository.findUnique({
      where: {
        id: chatRoomId,
      },
      include: {
        usersChatRooms: {
          include: {
            user: true,
          },
        },
      },
    });

    return userChatRoom;
  }
}
