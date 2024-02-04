import { IGroupPermission } from '../groupsPermissions/groupsPermissions.interface';
import { IPermission } from '../permissions/permissions.interface';
import { IUserGroup } from '../usersGroups/usersGroups.interface';

export interface IGroup {
  id: string;
  name: string;
  permissions: IPermission[];
  createdAt: Date;
  updatedAt: Date;
  groupPermission: IGroupPermission[];
  userGroup: IUserGroup[];
}
