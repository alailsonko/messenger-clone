import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserChatRoomCommand } from './commands/impl';
import { LoggerService } from 'src/infra/logger/logger.service';
import { IChatRoom } from 'src/domain/chatRooms/chat-rooms.interface';
import {
  CheckUserChatRoomExistsQuery,
  GetUserChatRoomQuery,
  GetUserChatRoomsQuery,
} from './queries/impl';
import { PagedResult } from 'src/common/types/paged-result.type';
import { ChatRoomEntity } from 'src/domain/chatRooms';

@Injectable()
export class ChatRoomsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ChatRoomsService.name);
  }

  async checkUserChatRoomExists(
    userId: string,
    recipientIds: string[],
  ): Promise<Pick<IChatRoom, 'id'> | null> {
    this.logger.log('Checking if chat room already exists...');

    const exists = await Promise.all(
      recipientIds.map((recipientId) =>
        this.queryBus.execute<
          CheckUserChatRoomExistsQuery,
          Pick<IChatRoom, 'id'> | null
        >(new CheckUserChatRoomExistsQuery(userId, recipientId)),
      ),
    );

    this.logger.log('Result of chat room check', {
      exists,
    });

    return exists[0] || null;
  }

  async createUserChatRoom(
    userId: string,
    data: {
      name: string;
      userIds: string[];
    },
  ): Promise<{ id: string }> {
    this.logger.log('Creating chat room...');

    return this.commandBus.execute<CreateUserChatRoomCommand, { id: string }>(
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
    const response = await this.queryBus.execute<
      GetUserChatRoomsQuery,
      PagedResult<ChatRoomEntity>
    >(new GetUserChatRoomsQuery(userId, query));

    return {
      data: response.data.map((chatRoom) => chatRoom.toObject()),
      count: response.count,
    };
  }

  async getUserChatRoom(
    userId: string,
    chatRoomId: string,
  ): Promise<IChatRoom> {
    return this.queryBus.execute<GetUserChatRoomQuery, IChatRoom>(
      new GetUserChatRoomQuery(userId, chatRoomId),
    );
  }
}
