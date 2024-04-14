import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserChatRoomCommand } from './commands/impl';
import { LoggerService } from 'src/infra/logger/logger.service';
import { IChatRoom } from 'src/domain/chatRooms/chat-rooms.interface';
import { GetUserChatRoomsQuery } from './queries/impl';
import { PagedResult } from 'src/common/types/paged-result.type';

@Injectable()
export class ChatRoomsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ChatRoomsService.name);
  }

  async createUserChatRoom(
    userId: string,
    data: {
      name: string;
      userIds: string[];
    },
  ): Promise<IChatRoom> {
    this.logger.log('Creating chat room...');

    return this.commandBus.execute<CreateUserChatRoomCommand, IChatRoom>(
      new CreateUserChatRoomCommand(userId, {
        name: data.name,
        userIds: data.userIds,
      }),
    );
  }

  async getUserChatRooms(
    userId: string,
    query: {
      take: number;
      skip: number;
    },
  ): Promise<PagedResult<IChatRoom>> {
    return this.queryBus.execute<GetUserChatRoomsQuery, PagedResult<IChatRoom>>(
      new GetUserChatRoomsQuery(userId, query),
    );
  }
}
