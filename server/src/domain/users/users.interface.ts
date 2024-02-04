import { IAdminLog } from '../adminLogs/adminLogs.interface';
import { IUserGroup } from '../usersGroups/usersGroups.interface';
import { IUserPermission } from '../usersPermissions/usersPermissions.interface';

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
  userPermissions: IUserPermission[];
  userGroup: IUserGroup[];
  adminLog: IAdminLog[];
}
