import { UsersEntity } from 'src/domain/users';

type CreateUserParameterType = Pick<
  UsersEntity,
  'firstName' | 'email' | 'lastName' | 'password' | 'username'
>;

export class CreateUserCommand {
  constructor(public readonly user: CreateUserParameterType) {}
}
