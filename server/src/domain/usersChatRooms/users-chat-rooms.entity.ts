import { UserChatRoomAbstract } from './users-chat-rooms.abstract';

export class UserChatRoomEntity implements UserChatRoomAbstract {
  private _userId: string;
  private _chatRoomId: string;

  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  get chatRoomId(): string {
    return this._chatRoomId;
  }
  set chatRoomId(value: string) {
    this._chatRoomId = value;
  }

  public static create(data: UserChatRoomAbstract): UserChatRoomEntity {
    const entity = new UserChatRoomEntity();

    entity.userId = data.userId;
    entity.chatRoomId = data.chatRoomId;

    return entity;
  }
}
