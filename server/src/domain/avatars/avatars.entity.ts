import { AvatarAbstract } from './avatars.abstract';
import { IAvatar } from './avatars.interface';

export class AvatarEntity implements AvatarAbstract {
  protected _id: string;
  protected _userId: string;
  protected _url: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  protected constructor(data: IAvatar) {
    this._id = data.id;
    this._userId = data.userId;
    this._url = data.url;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get url(): string {
    return this._url;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public static create(data: IAvatar): AvatarEntity {
    const entity = new AvatarEntity(data);

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
