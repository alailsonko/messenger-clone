import { Request as RequestType } from 'express';
import { IUser } from 'src/domain/users';

export type AuthenticatedRequest = RequestType & { user: IUser };
