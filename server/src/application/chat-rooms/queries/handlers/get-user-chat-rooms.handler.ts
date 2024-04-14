import { QueryHandler } from '@nestjs/cqrs';
import { GetUserChatRoomsQuery } from '../impl';
import { ChatRoomsRepository } from 'src/domain/chatRooms/chat-rooms.repository';
import { PagedResult } from 'src/common/types/paged-result.type';
import { IChatRoom } from 'src/domain/chatRooms/chat-rooms.interface';

@QueryHandler(GetUserChatRoomsQuery)
export class GetUserChatRoomsHandler {
  constructor(private readonly repository: ChatRoomsRepository) {}

  async execute(query: GetUserChatRoomsQuery): Promise<PagedResult<IChatRoom>> {
    const { userId, query: chatRoomsQuery } = query;

    const { take, skip } = chatRoomsQuery;

    const chatRooms = await this.repository.findAll({
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

    const chatRoomsCount = await this.repository.count({
      usersChatRooms: {
        some: {
          userId,
        },
      },
    });

    return {
      data: chatRooms,
      count: chatRoomsCount,
    };
  }
}
