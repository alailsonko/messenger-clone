import { UsersEntity } from 'src/domain/users';

export type CreateUserParameterType = Pick<
  UsersEntity,
  'firstName' | 'email' | 'lastName' | 'password' | 'username'
>;
