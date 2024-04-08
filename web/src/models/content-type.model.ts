import { AdminLogModel } from './admin-log.model';
import { PermissionModel } from './permission.model';

export interface ContentTypeModel {
  id: string;
  appLabel: string;
  model: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  permission: PermissionModel | null;
  permissionId: string | null;
  adminLog: AdminLogModel[];
}
