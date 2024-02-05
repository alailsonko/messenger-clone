import { IGroupPermission } from '../groupsPermissions/groupsPermissions.interface';
import { IPermission } from '../permissions/permissions.interface';
import { IUserGroup } from '../usersGroups/usersGroups.interface';

export abstract class GroupAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get name(): string;
  abstract set name(value: string);

  abstract get permissions(): IPermission[];
  abstract set permissions(value: IPermission[]);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);

  abstract get groupPermission(): IGroupPermission[];
  abstract set groupPermission(value: IGroupPermission[]);

  abstract get userGroup(): IUserGroup[];
  abstract set userGroup(value: IUserGroup[]);
}
