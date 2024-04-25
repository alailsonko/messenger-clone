import { ChatRoomAbstract } from './chat-rooms.abstract';

export class ChatRoomEntity implements ChatRoomAbstract {
  private _id: string;
  private _name: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
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

  public static create(data: ChatRoomAbstract): ChatRoomEntity {
    const entity = new ChatRoomEntity();
    entity.id = data.id;
    entity.name = data.name;
    entity.createdAt = data.createdAt;
    entity.updatedAt = data.updatedAt;
    return entity;
  }

  public toObject(): ChatRoomAbstract {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
