import { IGroup } from '../groups/groups.interface';
import { IUser } from '../users';
import { PermissionAbstract } from './permissions.abstract';

export class PermissionEntity extends PermissionAbstract {
  protected _id: string;
  protected _name: string;
  protected _codename: string;
  protected _contentTypeId: string;
  protected _groups?: IGroup[];
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

  get codename(): string {
    return this._codename;
  }
  set codename(value: string) {
    this._codename = value;
  }

  get contentTypeId(): string {
    return this._contentTypeId;
  }
  set contentTypeId(value: string) {
    this._contentTypeId = value;
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

  get users(): IUser[] {
    return this._users;
  }
  set users(value: IUser[]) {
    this._users = value;
  }

  public static create(data: PermissionAbstract): PermissionEntity {
    const permission = new PermissionEntity();
    permission.id = data.id;
    permission.name = data.name;
    permission.codename = data.codename;
    permission.contentTypeId = data.contentTypeId;
    permission.groups = data.groups;
    permission.createdAt = data.createdAt;
    permission.updatedAt = data.updatedAt;
    permission.users = data.users;
    return permission;
  }

  public toObject(): PermissionAbstract {
    return {
      id: this.id,
      name: this.name,
      codename: this.codename,
      contentTypeId: this.contentTypeId,
      groups: this.groups,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      users: this.users,
    };
  }
}
