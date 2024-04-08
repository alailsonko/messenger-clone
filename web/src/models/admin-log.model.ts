import { ContentTypeModel } from './content-type.model';
import { UserModel } from './user.model';

export interface AdminLogModel {
  id: string;
  action: string;
  objectId: string;
  objectRepr: string;
  changeMessage: string;
  createdAt: Date;
  updatedAt: Date;
  user?: UserModel;
  userId: string;
  contentType?: ContentTypeModel;
  contentTypeId: string;
}
