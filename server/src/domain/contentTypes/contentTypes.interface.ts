import { IAdminLog } from '../adminLogs/adminLogs.interface';
import { IPermission } from '../permissions/permissions.interface';

export interface IContentType {
  id: string;
  appLabel: string;
  model: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  permission?: IPermission | null;
  permissionId?: string | null;
  adminLog?: IAdminLog[];
}
