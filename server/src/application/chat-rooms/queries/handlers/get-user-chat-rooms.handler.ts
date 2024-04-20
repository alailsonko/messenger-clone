import { QueryHandler } from '@nestjs/cqrs';
import { GetUserChatRoomsQuery } from '../impl';
import { ChatRoomsRepository } from 'src/domain/chatRooms/chat-rooms.repository';
import { PagedResult } from 'src/common/types/paged-result.type';
import { LoggerService } from 'src/infra/logger/logger.service';
import { UsersChatRoomsRepository } from 'src/domain/usersChatRooms/users-chat-rooms.repository';

@QueryHandler(GetUserChatRoomsQuery)
export class GetUserChatRoomsHandler {
  constructor(
    private readonly repository: ChatRoomsRepository,
    private readonly usersChatRoomsRepository: UsersChatRoomsRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(query: GetUserChatRoomsQuery): Promise<PagedResult<any>> {
    const { userId, query: chatRoomsQuery } = query;

    const { take, skip } = chatRoomsQuery;

    const userChatRooms = await this.repository.findAll({
      skip,
      take,
      where: {
        usersChatRooms: {
          some: {
            userId,
          },
        },
      },
    });

    const chatRoomsIdList = userChatRooms.map((chatRoom) => chatRoom.id);

    const chatRoomsPromise = this.repository.findAll({
      where: {
        usersChatRooms: {
          some: {
            chatRoomId: {
              in: chatRoomsIdList,
            },
          },
        },
      },
      include: {
        usersChatRooms: {
          include: {
            user: true,
          },
        },
      },
    });

    const chatRoomsCountPromise = this.repository.count({
      usersChatRooms: {
        some: {
          userId,
        },
      },
    });

    const [chatRooms, chatRoomsCount] = await Promise.all([
      chatRoomsPromise,
      chatRoomsCountPromise,
    ]);

    return {
      data: chatRooms,
      count: chatRoomsCount,
    };
  }
}
