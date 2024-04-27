import { IMessage } from '../messages';
import { IUserChatRoom } from '../usersChatRooms';
import { ChatRoomAbstract } from './chat-rooms.abstract';
import { IChatRoom } from './chat-rooms.interface';

export class ChatRoomEntity implements ChatRoomAbstract {
  protected _id: string;
  protected _name: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _messages?: IMessage[];
  protected _usersChatRooms?: IUserChatRoom[];

  protected constructor(data: IChatRoom) {
    this._id = data.id;
    this._name = data.name;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._messages = data.messages;
    this._usersChatRooms = data.usersChatRooms;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get messages(): IMessage[] {
    return this._messages;
  }

  get usersChatRooms(): IUserChatRoom[] {
    return this._usersChatRooms;
  }

  public static create(data: IChatRoom): ChatRoomEntity {
    const entity = new ChatRoomEntity(data);

    return entity;
  }

  public toObject(): IChatRoom {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      messages: this.messages,
      usersChatRooms: this.usersChatRooms,
    };
  }
}
