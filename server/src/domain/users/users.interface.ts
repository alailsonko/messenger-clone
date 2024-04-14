import { IAdminLog } from '../adminLogs/adminLogs.interface';
import { IAvatar } from '../avatars/avatars.interface';
import { IGroup } from '../groups';
import { IPermission } from '../permissions';

export interface IUser {
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
  permissions?: IPermission[];
  groups?: IGroup[];
  adminLogs?: IAdminLog[];
  avatar?: IAvatar;
}
