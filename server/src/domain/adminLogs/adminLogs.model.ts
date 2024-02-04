import { IContentType } from '../contentTypes/contentTypes.interface';
import { IUser } from '../users/users.interface';
import { AdminLogsEntity } from './adminLogs.entity';

export class AdminLogModel extends AdminLogsEntity {
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
}
