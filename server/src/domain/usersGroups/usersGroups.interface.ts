import { IGroup } from '../groups/groups.interface';
import { IUser } from '../users/users.interface';

export interface IUserGroup {
  id: string;
  user: IUser;
  group: IGroup;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  groupId: string;
}
