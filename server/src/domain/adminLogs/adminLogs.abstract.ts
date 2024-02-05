import { IContentType } from '../contentTypes/contentTypes.interface';
import { IUser } from '../users/users.interface';
import { IAdminLog } from './adminLogs.interface';

export abstract class AdminLogsAbstract implements IAdminLog {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get action(): string;
  abstract set action(value: string);

  abstract get objectId(): string;
  abstract set objectId(value: string);

  abstract get objectRepr(): string;
  abstract set objectRepr(value: string);

  abstract get changeMessage(): string;
  abstract set changeMessage(value: string);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);

  abstract get user(): IUser;
  abstract set user(value: IUser);

  abstract get userId(): string;
  abstract set userId(value: string);

  abstract get contentType(): IContentType;
  abstract set contentType(value: IContentType);

  abstract get contentTypeId(): string;
  abstract set contentTypeId(value: string);
}
