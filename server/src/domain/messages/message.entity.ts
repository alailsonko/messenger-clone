import { MessageAbstract } from './message.abstract';

export class MessageEntity implements MessageAbstract {
  private _id: string;
  private _content: string;
  private _senderId: string;
  private _chatRoomId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }
  get chatRoomId(): string {
    return this._chatRoomId;
  }
  set chatRoomId(value: string) {
    this._chatRoomId = value;
  }

  get content(): string {
    return this._content;
  }
  set content(value: string) {
    this._content = value;
  }

  get senderId(): string {
    return this._senderId;
  }
  set senderId(value: string) {
    this._senderId = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  public static create(data: MessageAbstract): MessageEntity {
    const entity = new MessageEntity();
    entity.id = data.id;
    entity.content = data.content;
    entity.senderId = data.senderId;
    entity.chatRoomId = data.chatRoomId;
    entity.createdAt = data.createdAt;
    entity.updatedAt = data.updatedAt;
    return entity;
  }

  public toObject(): MessageAbstract {
    return {
      id: this.id,
      content: this.content,
      senderId: this.senderId,
      chatRoomId: this.chatRoomId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
