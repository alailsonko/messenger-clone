import { IContentType } from '../contentTypes/contentTypes.interface';
import { IUser } from '../users/users.interface';

export interface IAdminLog {
  id: string;
  action: string;
  objectId: string;
  objectRepr: string;
  changeMessage: string;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
  userId: string;
  contentType: IContentType;
  contentTypeId: string;
}
