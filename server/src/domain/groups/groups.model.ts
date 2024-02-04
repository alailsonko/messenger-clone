import { IGroupPermission } from '../groupsPermissions/groupsPermissions.interface';
import { IPermission } from '../permissions/permissions.interface';
import { IUserGroup } from '../usersGroups/usersGroups.interface';
import { GroupEntity } from './groups.entity';

export class GroupModel extends GroupEntity {
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

  get permissions(): IPermission[] {
    return this._permissions;
  }
  set permissions(value: IPermission[]) {
    this._permissions = value;
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

  get groupPermission(): IGroupPermission[] {
    return this._groupPermission;
  }
  set groupPermission(value: IGroupPermission[]) {
    this._groupPermission = value;
  }

  get userGroup(): IUserGroup[] {
    return this._userGroup;
  }
  set userGroup(value: IUserGroup[]) {
    this._userGroup = value;
  }
}
