import { IGroup } from '../groups/groups.interface';
import { IUser } from '../users';

export interface IPermission {
  id: string;
  name: string;
  codename: string;
  contentTypeId: string;
  groups?: IGroup[];
  createdAt: Date;
  updatedAt: Date;
  users?: IUser[];
}
