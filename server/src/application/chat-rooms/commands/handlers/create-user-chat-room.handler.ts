import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserChatRoomCommand } from '../impl';
import { LoggerService } from 'src/infra/logger/logger.service';
import { ChatRoomsRepository } from 'src/domain/chatRooms/chat-rooms.repository';
import { UsersChatRoomsRepository } from 'src/domain/usersChatRooms/users-chat-rooms.repository';

@CommandHandler(CreateUserChatRoomCommand)
export class CreateUserChatRoomHandler
  implements ICommandHandler<CreateUserChatRoomCommand>
{
  constructor(
    private readonly repository: ChatRoomsRepository,
    private readonly usersChatRoomsRepository: UsersChatRoomsRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(CreateUserChatRoomHandler.name);
  }

  async execute(command: CreateUserChatRoomCommand): Promise<{ id: string }> {
    const { data, userId: creatorUserId } = command;

    const response = await this.repository.create({
      name: data.name,
    });

    this.logger.log(`Chat room created with ID ${response.id}`);

    if (data.userIds.find((userId) => userId === creatorUserId)) {
      await this.usersChatRoomsRepository.create({
        user: {
          connect: {
            id: creatorUserId,
          },
        },
        chatRoom: {
          connect: {
            id: response.id,
          },
        },
      });
    } else {
      await this.usersChatRoomsRepository.createTrx([
        {
          user: {
            connect: {
              id: creatorUserId,
            },
          },
          chatRoom: {
            connect: {
              id: response.id,
            },
          },
        },
        ...data.userIds.map((userId) => ({
          user: {
            connect: {
              id: userId,
            },
          },
          chatRoom: {
            connect: {
              id: response.id,
            },
          },
        })),
      ]);
    }

    return {
      id: response.id,
    };
  }
}
