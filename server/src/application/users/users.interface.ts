import { CreateUserRequest, CreateUserResponse } from './users.type';

export interface IUsersService {
  createUser(user: CreateUserRequest): Promise<CreateUserResponse>;
}
