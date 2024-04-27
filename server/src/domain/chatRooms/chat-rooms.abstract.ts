import { IMessage } from '../messages';
import { IUserChatRoom } from '../usersChatRooms';
import { IChatRoom } from './chat-rooms.interface';

export abstract class ChatRoomAbstract implements IChatRoom {
  abstract get id(): string;

  abstract get name(): string;

  abstract get createdAt(): Date;

  abstract get updatedAt(): Date;

  abstract get messages(): IMessage[];

  abstract get usersChatRooms(): IUserChatRoom[];
}
