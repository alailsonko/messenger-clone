import { IAdminLog } from '../adminLogs/adminLogs.interface';
import { IUserGroup } from '../usersGroups/usersGroups.interface';
import { IUserPermission } from '../usersPermissions/usersPermissions.interface';
import { IUser } from './users.interface';

abstract class UserAbstract implements IUser {
  protected _isSuperUser: boolean;
  protected _firstName: string;
  protected _lastName: string;
  protected _isStaff: boolean;
  protected _isActive: boolean;
  protected _userPermissions: IUserPermission[];
  protected _userGroup: IUserGroup[];
  protected _adminLog: IAdminLog[];
  protected _id: string;
  protected _username: string;
  protected _password: string;
  protected _email: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _lastLogin: Date | null;

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

  get userPermissions(): IUserPermission[] {
    return this._userPermissions;
  }

  set userPermissions(value: IUserPermission[]) {
    this._userPermissions = value;
  }

  get userGroup(): IUserGroup[] {
    return this._userGroup;
  }

  set userGroup(value: IUserGroup[]) {
    this._userGroup = value;
  }

  get adminLog(): IAdminLog[] {
    return this._adminLog;
  }

  set adminLog(value: IAdminLog[]) {
    this._adminLog = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
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
}

export { UserAbstract };
