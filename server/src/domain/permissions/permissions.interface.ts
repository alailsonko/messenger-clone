import { IContentType } from '../contentTypes/contentTypes.interface';
import { IGroup } from '../groups/groups.interface';
import { IGroupPermission } from '../groupsPermissions/groupsPermissions.interface';
import { IUserPermission } from '../usersPermissions/usersPermissions.interface';

export interface IPermission {
  id: string;
  name: string;
  codename: string;
  contentTypes: IContentType[];
  groups: IGroup[];
  createdAt: Date;
  updatedAt: Date;
  userPermission: IUserPermission[];
  groupPermission: IGroupPermission[];
}
