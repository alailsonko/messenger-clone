// groupPermission.entity.ts
import { IGroup } from '../groups/groups.interface';
import { IPermission } from '../permissions/permissions.interface';
import { GroupPermissionAbstract } from './groupsPermissions.abstract';

export class GroupPermissionEntity extends GroupPermissionAbstract {
  protected _id: string;
  protected _group: IGroup;
  protected _permission: IPermission;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _groupId: string;
  protected _permissionId: string;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get group(): IGroup {
    return this._group;
  }
  set group(value: IGroup) {
    this._group = value;
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

  get groupId(): string {
    return this._groupId;
  }
  set groupId(value: string) {
    this._groupId = value;
  }

  get permissionId(): string {
    return this._permissionId;
  }
  set permissionId(value: string) {
    this._permissionId = value;
  }

  public static create(data: GroupPermissionAbstract): GroupPermissionEntity {
    const entity = new GroupPermissionEntity();
    entity.id = data.id;
    entity.group = data.group;
    entity.permission = data.permission;
    entity.createdAt = data.createdAt;
    entity.updatedAt = data.updatedAt;
    entity.groupId = data.groupId;
    entity.permissionId = data.permissionId;
    return entity;
  }

  public toObject(): GroupPermissionAbstract {
    return {
      id: this.id,
      group: this.group,
      permission: this.permission,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      groupId: this.groupId,
      permissionId: this.permissionId,
    };
  }
}
