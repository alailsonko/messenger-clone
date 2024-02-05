// permission.entity.ts
import { IContentType } from '../contentTypes/contentTypes.interface';
import { IGroup } from '../groups/groups.interface';
import { IGroupPermission } from '../groupsPermissions/groupsPermissions.interface';
import { IUserPermission } from '../usersPermissions/usersPermissions.interface';
import { PermissionAbstract } from './permissions.abstract';

export class PermissionEntity extends PermissionAbstract {
  protected _id: string;
  protected _name: string;
  protected _codename: string;
  protected _contentTypes: IContentType[];
  protected _groups: IGroup[];
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _userPermission: IUserPermission[];
  protected _groupPermission: IGroupPermission[];

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get codename(): string {
    return this._codename;
  }
  set codename(value: string) {
    this._codename = value;
  }

  get contentTypes(): IContentType[] {
    return this._contentTypes;
  }
  set contentTypes(value: IContentType[]) {
    this._contentTypes = value;
  }

  get groups(): IGroup[] {
    return this._groups;
  }
  set groups(value: IGroup[]) {
    this._groups = value;
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

  get userPermission(): IUserPermission[] {
    return this._userPermission;
  }
  set userPermission(value: IUserPermission[]) {
    this._userPermission = value;
  }

  get groupPermission(): IGroupPermission[] {
    return this._groupPermission;
  }
  set groupPermission(value: IGroupPermission[]) {
    this._groupPermission = value;
  }
}
