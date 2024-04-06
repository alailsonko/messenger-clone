import { IPermission } from '../permissions/permissions.interface';
import { IUser } from '../users';

export interface IGroup {
  id: string;
  name: string;
  permissions?: IPermission[];
  createdAt: Date;
  updatedAt: Date;
  users?: IUser[];
}
