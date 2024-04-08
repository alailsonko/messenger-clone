import { AdminLogModel } from './admin-log.model';
import { GroupModel } from './group.model';
import { PermissionModel } from './permission.model';

export interface UserModel {
  id: string;
  password: string;
  lastLogin: Date | null;
  isSuperUser: boolean;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isStaff: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions?: PermissionModel[];
  groups?: GroupModel[];
  adminLogs?: AdminLogModel[];
}
