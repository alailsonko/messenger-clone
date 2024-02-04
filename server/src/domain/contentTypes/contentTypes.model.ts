import { IAdminLog } from '../adminLogs/adminLogs.interface';
import { IPermission } from '../permissions/permissions.interface';
import { ContentTypeEntity } from './contentTypes.entity';

export class ContentTypeModel extends ContentTypeEntity {
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
}
