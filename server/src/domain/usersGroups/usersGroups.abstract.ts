import { IGroup } from '../groups/groups.interface';
import { IUser } from '../users/users.interface';

export abstract class UserGroupAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get user(): IUser;
  abstract set user(value: IUser);

  abstract get group(): IGroup;
  abstract set group(value: IGroup);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);

  abstract get userId(): string;
  abstract set userId(value: string);

  abstract get groupId(): string;
  abstract set groupId(value: string);
}
