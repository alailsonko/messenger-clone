import { IAdminLog } from '../adminLogs/adminLogs.interface';
import { IPermission } from '../permissions/permissions.interface';

export abstract class ContentTypeAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get appLabel(): string;
  abstract set appLabel(value: string);

  abstract get model(): string;
  abstract set model(value: string);

  abstract get name(): string;
  abstract set name(value: string);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);

  abstract get permission(): IPermission | null;
  abstract set permission(value: IPermission | null);

  abstract get permissionId(): string | null;
  abstract set permissionId(value: string | null);

  abstract get adminLog(): IAdminLog[];
  abstract set adminLog(value: IAdminLog[]);
}
