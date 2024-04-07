import { PostAbstract } from './posts.abstract';

export class PostEntity implements PostAbstract {
  private _id: string;
  private _content: string;
  private _userId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get content(): string {
    return this._content;
  }
  set content(value: string) {
    this._content = value;
  }

  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
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
