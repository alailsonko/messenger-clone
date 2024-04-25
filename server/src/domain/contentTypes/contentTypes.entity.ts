import { ContentTypeAbstract } from './contentTypes.abstract';
import { IAdminLog } from '../adminLogs/adminLogs.interface';
import { IPermission } from '../permissions/permissions.interface';

export class ContentTypeEntity extends ContentTypeAbstract {
  protected _id: string;
  protected _appLabel: string;
  protected _model: string;
  protected _name: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _permission: IPermission | null;
  protected _permissionId: string | null;
  protected _adminLog: IAdminLog[];

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get appLabel(): string {
    return this._appLabel;
  }
  set appLabel(value: string) {
    this._appLabel = value;
  }

  get model(): string {
    return this._model;
  }
  set model(value: string) {
    this._model = value;
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

  get permission(): IPermission | null {
    return this._permission;
  }
  set permission(value: IPermission | null) {
    this._permission = value;
  }

  get permissionId(): string | null {
    return this._permissionId;
  }
  set permissionId(value: string | null) {
    this._permissionId = value;
  }

  get adminLog(): IAdminLog[] {
    return this._adminLog;
  }
  set adminLog(value: IAdminLog[]) {
    this._adminLog = value;
  }

  public static create(data: ContentTypeAbstract): ContentTypeEntity {
    const entity = new ContentTypeEntity();
    entity.id = data.id;
    entity.appLabel = data.appLabel;
    entity.model = data.model;
    entity.name = data.name;
    entity.createdAt = data.createdAt;
    entity.updatedAt = data.updatedAt;
    entity.permission = data.permission;
    entity.permissionId = data.permissionId;
    entity.adminLog = data.adminLog;

    return entity;
  }

  public toObject(): ContentTypeAbstract {
    return {
      id: this.id,
      appLabel: this.appLabel,
      model: this.model,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      permission: this.permission,
      permissionId: this.permissionId,
      adminLog: this.adminLog,
    };
  }
}
