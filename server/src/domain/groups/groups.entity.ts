import { GroupAbstract } from './groups.abstract';
import { IPermission } from '../permissions/permissions.interface';
import { IUser } from '../users';

export class GroupEntity extends GroupAbstract {
  protected _id: string;
  protected _name: string;
  protected _permissions?: IPermission[];
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _users?: IUser[];

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

  get users(): IUser[] {
    return this._users;
  }
  set users(value: IUser[]) {
    this._users = value;
  }

  public static create(data: GroupAbstract): GroupEntity {
    const group = new GroupEntity();
    group.id = data.id;
    group.name = data.name;
    group.permissions = data.permissions;
    group.createdAt = data.createdAt;
    group.updatedAt = data.updatedAt;
    group.users = data.users;
    return group;
  }

  public toObject(): GroupAbstract {
    return {
      id: this.id,
      name: this.name,
      permissions: this.permissions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      users: this.users,
    };
  }
}
