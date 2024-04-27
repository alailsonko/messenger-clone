import { AdminLogsAbstract } from './adminLogs.abstract';
import { IContentType } from '../contentTypes/contentTypes.interface';
import { IUser } from '../users/users.interface';
import { IAdminLog } from './adminLogs.interface';

export class AdminLogsEntity extends AdminLogsAbstract {
  protected _id: string;
  protected _action: string;
  protected _objectId: string;
  protected _objectRepr: string;
  protected _changeMessage: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _user?: IUser | null;
  protected _userId: string;
  protected _contentType?: IContentType | null;
  protected _contentTypeId: string;

  protected constructor(data: IAdminLog) {
    super();
    this._id = data.id;
    this._action = data.action;
    this._objectId = data.objectId;
    this._objectRepr = data.objectRepr;
    this._changeMessage = data.changeMessage;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._user = data.user;
    this._userId = data.userId;
    this._contentType = data.contentType;
    this._contentTypeId = data.contentTypeId;
  }

  get id(): string {
    return this._id;
  }

  get action(): string {
    return this._action;
  }

  get objectId(): string {
    return this._objectId;
  }

  get objectRepr(): string {
    return this._objectRepr;
  }

  get changeMessage(): string {
    return this._changeMessage;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get user(): IUser | null {
    return this._user;
  }

  get userId(): string {
    return this._userId;
  }

  get contentType(): IContentType | null {
    return this._contentType;
  }

  get contentTypeId(): string {
    return this._contentTypeId;
  }

  public static create(data: IAdminLog): AdminLogsEntity {
    const entity = new AdminLogsEntity(data);

    return entity;
  }

  public toObject(): IAdminLog {
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
