import { IsUUID, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { AdminLogsAbstract } from './adminLogs.abstract';
import { IContentType } from '../contentTypes/contentTypes.interface';
import { IUser } from '../users/users.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';

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

  @IsUUID('4', { groups: [OPERATIONS.READ] })
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  @IsString({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get action(): string {
    return this._action;
  }
  set action(value: string) {
    this._action = value;
  }

  @IsString({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get objectId(): string {
    return this._objectId;
  }
  set objectId(value: string) {
    this._objectId = value;
  }

  @IsString({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get objectRepr(): string {
    return this._objectRepr;
  }
  set objectRepr(value: string) {
    this._objectRepr = value;
  }

  @IsString({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get changeMessage(): string {
    return this._changeMessage;
  }
  set changeMessage(value: string) {
    this._changeMessage = value;
  }

  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(value: Date) {
    this._createdAt = value;
  }

  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
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

  @IsUUID('4', { groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
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

  @IsUUID('4', { groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get contentTypeId(): string {
    return this._contentTypeId;
  }
  set contentTypeId(value: string) {
    this._contentTypeId = value;
  }
}
