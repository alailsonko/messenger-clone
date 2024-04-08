import { PermissionModel } from './permission.model';
import { UserModel } from './user.model';

export interface GroupModel {
  id: string;
  name: string;
  permissions?: PermissionModel[];
  createdAt: Date;
  updatedAt: Date;
  users?: UserModel[];
}
