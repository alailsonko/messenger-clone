import { IGroup } from '../groups/groups.interface';
import { IUser } from '../users';

export abstract class PermissionAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get name(): string;
  abstract set name(value: string);

  abstract get codename(): string;
  abstract set codename(value: string);

  abstract get contentTypeId(): string;
  abstract set contentTypeId(value: string);

  abstract get groups(): IGroup[];
  abstract set groups(value: IGroup[]);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);

  abstract get users(): IUser[];
  abstract set users(value: IUser[]);
}
