import { IPermission } from '../permissions/permissions.interface';
import { IUser } from '../users/users.interface';

export interface IUserPermission {
  id: string;
  user: IUser;
  permission: IPermission;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  permissionId: string;
}
