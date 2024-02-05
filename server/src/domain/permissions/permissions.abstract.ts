// permission.abstract.ts
import { IContentType } from '../contentTypes/contentTypes.interface';
import { IGroup } from '../groups/groups.interface';
import { IGroupPermission } from '../groupsPermissions/groupsPermissions.interface';
import { IUserPermission } from '../usersPermissions/usersPermissions.interface';

export abstract class PermissionAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get name(): string;
  abstract set name(value: string);

  abstract get codename(): string;
  abstract set codename(value: string);

  abstract get contentTypes(): IContentType[];
  abstract set contentTypes(value: IContentType[]);

  abstract get groups(): IGroup[];
  abstract set groups(value: IGroup[]);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);

  abstract get userPermission(): IUserPermission[];
  abstract set userPermission(value: IUserPermission[]);

  abstract get groupPermission(): IGroupPermission[];
  abstract set groupPermission(value: IGroupPermission[]);
}
