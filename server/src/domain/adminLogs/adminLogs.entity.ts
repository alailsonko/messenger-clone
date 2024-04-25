import { AdminLogsAbstract } from './adminLogs.abstract';
import { IContentType } from '../contentTypes/contentTypes.interface';
import { IUser } from '../users/users.interface';

export class AdminLogsEntity extends AdminLogsAbstract {
  protected _id: string;
  protected _action: string;
  protected _objectId: string;
  protected _objectRepr: string;
  protected _changeMessage: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _user: IUser;
  protected _userId: string;
  protected _contentType: IContentType;
  protected _contentTypeId: string;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get action(): string {
    return this._action;
  }
  set action(value: string) {
    this._action = value;
  }

  get objectId(): string {
    return this._objectId;
  }
  set objectId(value: string) {
    this._objectId = value;
  }

  get objectRepr(): string {
    return this._objectRepr;
  }
  set objectRepr(value: string) {
    this._objectRepr = value;
  }

  get changeMessage(): string {
    return this._changeMessage;
  }
  set changeMessage(value: string) {
    this._changeMessage = value;
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

  get user(): IUser {
    return this._user;
  }
  set user(value: IUser) {
    this._user = value;
  }

  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  get contentType(): IContentType {
    return this._contentType;
  }
  set contentType(value: IContentType) {
    this._contentType = value;
  }

  get contentTypeId(): string {
    return this._contentTypeId;
  }
  set contentTypeId(value: string) {
    this._contentTypeId = value;
  }

  public static create(data: AdminLogsAbstract): AdminLogsEntity {
    const entity = new AdminLogsEntity();
    const {
      id,
      action,
      objectId,
      objectRepr,
      changeMessage,
      createdAt,
      updatedAt,
      user,
      userId,
      contentType,
      contentTypeId,
    } = data;

    entity.id = id;
    entity.action = action;
    entity.objectId = objectId;
    entity.objectRepr = objectRepr;
    entity.changeMessage = changeMessage;
    entity.createdAt = createdAt;
    entity.updatedAt = updatedAt;
    entity.user = user;
    entity.userId = userId;
    entity.contentType = contentType;
    entity.contentTypeId = contentTypeId;

    return entity;
  }

  public toObject(): AdminLogsAbstract {
    return {
      id: this.id,
      action: this.action,
      objectId: this.objectId,
      objectRepr: this.objectRepr,
      changeMessage: this.changeMessage,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId,
      contentTypeId: this.contentTypeId,
      contentType: this.contentType,
      user: this.user,
    };
  }
}
