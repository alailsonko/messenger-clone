import { QueryHandler } from '@nestjs/cqrs';
import { GetUserChatRoomQuery } from '../impl';
import { ChatRoomsRepository } from 'src/domain/chatRooms/chat-rooms.repository';
import { LoggerService } from 'src/infra/logger/logger.service';
import { IChatRoom } from 'src/domain/chatRooms/chat-rooms.interface';
import { UsersChatRoomsRepository } from 'src/domain/usersChatRooms';

@QueryHandler(GetUserChatRoomQuery)
export class GetUserChatRoomHandler {
  constructor(
    private readonly repository: ChatRoomsRepository,
    private readonly usersChatRoomsRepository: UsersChatRoomsRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(query: GetUserChatRoomQuery): Promise<IChatRoom> {
    const { userId, chatRoomId } = query;

    this.logger.log('Getting user chat room...', {
      userId,
      chatRoomId,
    });

    const [chatRoom, userChatRooms] = await Promise.all([
      this.repository.findUnique({
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
      }),
      this.usersChatRoomsRepository.findAll({
        where: {
          chatRoomId: chatRoomId,
        },
        include: {
          user: true,
        },
      }),
    ]);

    return {
      id: chatRoom.id,
      name: chatRoom.name,
      createdAt: chatRoom.createdAt,
      updatedAt: chatRoom.updatedAt,
      usersChatRooms: userChatRooms,
    };
  }
}
