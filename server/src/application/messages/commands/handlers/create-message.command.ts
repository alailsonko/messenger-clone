import {
  AggregateRoot,
  CommandHandler,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateMessageCommand } from '../impl';
import { MessagesRepository } from 'src/domain/messages/message.repository';
import { CreatedMessageEvent } from '../../events/impl';

@CommandHandler(CreateMessageCommand)
export class CreateMessageHandler
  extends AggregateRoot
  implements ICommandHandler<CreateMessageCommand>
{
  constructor(
    private readonly repository: MessagesRepository,
    private readonly publisher: EventPublisher,
  ) {
    super();
  }
  async execute(command: CreateMessageCommand) {
    const { chatRoomId, senderId, data } = command;

    const message = await this.repository.create({
      content: data.content,
      sender: {
        connect: {
          id: senderId,
        },
      },
      chatRoom: {
        connect: {
          id: chatRoomId,
        },
      },
    });

    this.apply(new CreatedMessageEvent(senderId, chatRoomId, message.id));

    this.publisher.mergeObjectContext(this).commit();
  }
}
