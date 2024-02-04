import { IGroup } from '../groups/groups.interface';
import { IPermission } from '../permissions/permissions.interface';

export interface IGroupPermission {
  id: string;
  group: IGroup;
  permission: IPermission;
  createdAt: Date;
  updatedAt: Date;
  groupId: string;
  permissionId: string;
}
