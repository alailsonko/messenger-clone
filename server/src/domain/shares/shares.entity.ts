import { ShareAbstract } from './shares.abstract';

export class ShareEntity implements ShareAbstract {
  private _id: string;
  private _userId: string;
  private _postId: string;
  private _createdAt: Date;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  get postId(): string {
    return this._postId;
  }
  set postId(value: string) {
    this._postId = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(value: Date) {
    this._createdAt = value;
  }
}
