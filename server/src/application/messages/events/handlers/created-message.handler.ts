import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreatedMessageEvent } from '../impl';
import { LoggerService } from 'src/infra/logger/logger.service';

@EventsHandler(CreatedMessageEvent)
export class CreatedMessageHandler
  implements IEventHandler<CreatedMessageEvent>
{
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(CreatedMessageHandler.name);
  }
  handle(event: CreatedMessageEvent) {
    const { userId, chatRoomId, messageId } = event;
    this.logger.log('Message created:', {
      userId,
      chatRoomId,
      messageId,
    });
  }
}
