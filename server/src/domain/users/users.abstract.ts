import { IAdminLog } from '../adminLogs/adminLogs.interface';
import { IUserGroup } from '../usersGroups/usersGroups.interface';
import { IUserPermission } from '../usersPermissions/usersPermissions.interface';
import { IUser } from './users.interface';

abstract class UserAbstract implements IUser {
  abstract get isSuperUser(): boolean;
  abstract set isSuperUser(value: boolean);

  abstract get firstName(): string;
  abstract set firstName(value: string);

  abstract get lastName(): string;
  abstract set lastName(value: string);

  abstract get isStaff(): boolean;
  abstract set isStaff(value: boolean);

  abstract get isActive(): boolean;
  abstract set isActive(value: boolean);

  abstract get userPermissions(): IUserPermission[];
  abstract set userPermissions(value: IUserPermission[]);

  abstract get userGroup(): IUserGroup[];
  abstract set userGroup(value: IUserGroup[]);

  abstract get adminLog(): IAdminLog[];
  abstract set adminLog(value: IAdminLog[]);

  abstract get id(): string;
  abstract set id(value: string);

  abstract get username(): string;
  abstract set username(value: string);

  abstract get password(): string;
  abstract set password(value: string);

  abstract get email(): string;
  abstract set email(value: string);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);

  abstract get lastLogin(): Date | null;
  abstract set lastLogin(value: Date | null);
}

export { UserAbstract };
