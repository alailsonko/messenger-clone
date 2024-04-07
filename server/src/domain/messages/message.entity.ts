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
}
