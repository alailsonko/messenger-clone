// groupPermission.abstract.ts
import { IGroup } from '../groups/groups.interface';
import { IPermission } from '../permissions/permissions.interface';

export abstract class GroupPermissionAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get group(): IGroup;
  abstract set group(value: IGroup);

  abstract get permission(): IPermission;
  abstract set permission(value: IPermission);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);

  abstract get groupId(): string;
  abstract set groupId(value: string);

  abstract get permissionId(): string;
  abstract set permissionId(value: string);
}
