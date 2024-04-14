import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserChatRoomCommand } from '../impl';
import { LoggerService } from 'src/infra/logger/logger.service';
import { ChatRoomsRepository } from 'src/domain/chatRooms/chat-rooms.repository';
import { UsersChatRoomsRepository } from 'src/domain/usersChatRooms/users-chat-rooms.repository';
import { IChatRoom } from 'src/domain/chatRooms/chat-rooms.interface';

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

  async execute(command: CreateUserChatRoomCommand): Promise<IChatRoom> {
    const { data, userId: creatorUserId } = command;

    const response = await this.repository.create({
      name: data.name,
    });

    this.logger.log(`Chat room created with ID ${response.id}`);

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

    await Promise.all(
      data.userIds.map(async (userId) => {
        await this.usersChatRoomsRepository.create({
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
        });
      }),
    );

    return response;
  }
}
