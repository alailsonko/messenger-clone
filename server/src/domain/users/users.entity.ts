import { UserAbstract } from './users.abstract';
import { AdminLogModel, AdminLogsEntity } from '../adminLogs';
import { GroupEntity, GroupModel } from '../groups';
import { PermissionEntity, PermissionModel } from '../permissions';
import { AvatarEntity, AvatarModel } from '../avatars';

class UsersEntity extends UserAbstract {
  private _isSuperUser: boolean;
  private _firstName: string;
  private _lastName: string;
  private _isStaff: boolean;
  private _isActive: boolean;
  private _permissions: PermissionModel[];
  private _groups: GroupModel[];
  private _adminLogs: AdminLogModel[];
  private _avatar: AvatarModel;
  private _id: string;
  private _username: string;
  private _password: string;
  private _email: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _lastLogin: Date | null;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get isSuperUser(): boolean {
    return this._isSuperUser;
  }
  set isSuperUser(value: boolean) {
    this._isSuperUser = value;
  }

  get firstName(): string {
    return this._firstName;
  }
  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }
  set lastName(value: string) {
    this._lastName = value;
  }

  get isStaff(): boolean {
    return this._isStaff;
  }
  set isStaff(value: boolean) {
    this._isStaff = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }
  set isActive(value: boolean) {
    this._isActive = value;
  }

  get username(): string {
    return this._username;
  }
  set username(value: string) {
    this._username = value;
  }

  get password(): string {
    return this._password;
  }
  set password(value: string) {
    this._password = value;
  }

  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
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

  get lastLogin(): Date | null {
    return this._lastLogin;
  }
  set lastLogin(value: Date | null) {
    this._lastLogin = value;
  }

  get permissions(): PermissionEntity[] {
    return this._permissions;
  }
  set permissions(value: PermissionEntity[]) {
    this._permissions = value;
  }

  get groups(): GroupEntity[] {
    return this._groups;
  }
  set groups(value: GroupEntity[]) {
    this._groups = value;
  }

  get adminLogs(): AdminLogsEntity[] {
    return this._adminLogs;
  }
  set adminLogs(value: AdminLogsEntity[]) {
    this._adminLogs = value;
  }

  get avatar(): AvatarEntity {
    return this._avatar;
  }
  set avatar(value: AvatarEntity) {
    this._avatar = value;
  }

  public static create(data: UserAbstract): UsersEntity {
    const entity = new UsersEntity();
    const {
      id,
      isSuperUser,
      firstName,
      lastName,
      isStaff,
      isActive,
      username,
      password,
      email,
      createdAt,
      updatedAt,
      lastLogin,
      permissions,
      groups,
      adminLogs,
      avatar,
    } = data;

    entity.id = id;
    entity.isSuperUser = isSuperUser;
    entity.firstName = firstName;
    entity.lastName = lastName;
    entity.isStaff = isStaff;
    entity.isActive = isActive;
    entity.username = username;
    entity.password = password;
    entity.email = email;
    entity.createdAt = createdAt;
    entity.updatedAt = updatedAt;
    entity.lastLogin = lastLogin;
    entity.permissions =
      permissions && permissions.length
        ? permissions.map(PermissionEntity.create)
        : [];
    entity.groups =
      groups && groups.length ? groups.map(GroupEntity.create) : [];
    entity.adminLogs =
      adminLogs && adminLogs.length
        ? adminLogs.map(AdminLogsEntity.create)
        : [];
    entity.avatar = avatar ? AvatarEntity.create(avatar) : null;

    return entity;
  }

  public toObject(): UserAbstract {
    return {
      id: this.id,
      isSuperUser: this.isSuperUser,
      firstName: this.firstName,
      lastName: this.lastName,
      isStaff: this.isStaff,
      isActive: this.isActive,
      username: this.username,
      password: this.password,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLogin: this.lastLogin,
      permissions: this.permissions.map((permission) => permission.toObject()),
      groups: this.groups.map((group) => group.toObject()),
      adminLogs: this.adminLogs.map((adminLog) => adminLog.toObject()),
      avatar: this.avatar ? this.avatar.toObject() : null,
    };
  }
}

export { UsersEntity };
