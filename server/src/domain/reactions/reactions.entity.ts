import { ReactionAbstract } from './reactions.abstract';

export class ReactionEntity implements ReactionAbstract {
  private _id: string;
  private _type: string;
  private _userId: string;
  private _messageId: string;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
  }

  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  get messageId(): string {
    return this._messageId;
  }
  set messageId(value: string) {
    this._messageId = value;
  }

  public static create(data: ReactionAbstract): ReactionEntity {
    const entity = new ReactionEntity();
    entity.id = data.id;
    entity.type = data.type;
    entity.userId = data.userId;
    entity.messageId = data.messageId;
    return entity;
  }

  public toObject(): ReactionAbstract {
    return {
      id: this.id,
      type: this.type,
      userId: this.userId,
      messageId: this.messageId,
    };
  }
}
