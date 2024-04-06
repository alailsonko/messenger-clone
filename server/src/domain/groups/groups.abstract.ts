import { IPermission } from '../permissions/permissions.interface';
import { IUser } from '../users';

export abstract class GroupAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get name(): string;
  abstract set name(value: string);

  abstract get permissions(): IPermission[];
  abstract set permissions(value: IPermission[]);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);

  abstract get users(): IUser[];
  abstract set users(value: IUser[]);
}
