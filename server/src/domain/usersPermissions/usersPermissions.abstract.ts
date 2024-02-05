import { IPermission } from '../permissions/permissions.interface';
import { IUser } from '../users/users.interface';

export abstract class UserPermissionAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get user(): IUser;
  abstract set user(value: IUser);

  abstract get permission(): IPermission;
  abstract set permission(value: IPermission);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);

  abstract get userId(): string;
  abstract set userId(value: string);

  abstract get permissionId(): string;
  abstract set permissionId(value: string);
}
