import { AvatarAbstract } from './avatars.abstract';

export class AvatarEntity implements AvatarAbstract {
  private _id: string;
  private _userId: string;
  private _url: string;
  private _createdAt: Date;
  private _updatedAt: Date;

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

  get url(): string {
    return this._url;
  }
  set url(value: string) {
    this._url = value;
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

  public static create(data: AvatarAbstract): AvatarEntity {
    const entity = new AvatarEntity();
    entity.id = data.id;
    entity.userId = data.userId;
    entity.url = data.url;
    entity.createdAt = data.createdAt;
    entity.updatedAt = data.updatedAt;
    return entity;
  }

  public toObject(): AvatarAbstract {
    return {
      id: this.id,
      userId: this.userId,
      url: this.url,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
