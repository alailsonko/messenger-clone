import { GroupModel } from './group.model';
import { UserModel } from './user.model';

export interface PermissionModel {
  id: string;
  name: string;
  codename: string;
  contentTypeId: string;
  groups?: GroupModel[];
  createdAt: Date;
  updatedAt: Date;
  users?: UserModel[];
}
