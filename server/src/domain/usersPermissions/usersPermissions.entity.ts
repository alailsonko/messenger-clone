// userPermission.entity.ts
import { IPermission } from '../permissions/permissions.interface';
import { IUser } from '../users/users.interface';
import { UserPermissionAbstract } from './usersPermissions.abstract';

export class UserPermissionEntity extends UserPermissionAbstract {
  protected _id: string;
  protected _user: IUser;
  protected _permission: IPermission;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _userId: string;
  protected _permissionId: string;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get user(): IUser {
    return this._user;
  }
  set user(value: IUser) {
    this._user = value;
  }

  get permission(): IPermission {
    return this._permission;
  }
  set permission(value: IPermission) {
    this._permission = value;
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

  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  get permissionId(): string {
    return this._permissionId;
  }
  set permissionId(value: string) {
    this._permissionId = value;
  }
}
