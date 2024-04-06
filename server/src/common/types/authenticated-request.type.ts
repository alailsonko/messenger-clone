import { Request as RequestType } from 'express';
import { UsersModel } from 'src/domain/users';

export type AuthenticatedRequest = RequestType & { user: UsersModel };
