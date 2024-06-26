import { QueryHandler } from '@nestjs/cqrs';
import { GetUserChatRoomsQuery } from '../impl';
import { ChatRoomsRepository } from 'src/domain/chatRooms/chat-rooms.repository';
import { PagedResult } from 'src/common/types/paged-result.type';
import { LoggerService } from 'src/infra/logger/logger.service';
import { ChatRoomEntity } from 'src/domain/chatRooms';

@QueryHandler(GetUserChatRoomsQuery)
export class GetUserChatRoomsHandler {
  constructor(
    private readonly repository: ChatRoomsRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    query: GetUserChatRoomsQuery,
  ): Promise<PagedResult<ChatRoomEntity>> {
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
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              include: {
                avatar: true,
              },
            },
          },
        },
        usersChatRooms: {
          include: {
            user: {
              include: {
                avatar: true,
              },
            },
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
