import { IContentType } from '../contentTypes/contentTypes.interface';
import { IUser } from '../users/users.interface';
import { IAdminLog } from './adminLogs.interface';

export abstract class AdminLogsAbstract implements IAdminLog {
  abstract get id(): string;

  abstract get action(): string;

  abstract get objectId(): string;

  abstract get objectRepr(): string;

  abstract get changeMessage(): string;

  abstract get createdAt(): Date;

  abstract get updatedAt(): Date;

  abstract get user(): IUser | null;

  abstract get userId(): string;

  abstract get contentType(): IContentType | null;

  abstract get contentTypeId(): string;
}
