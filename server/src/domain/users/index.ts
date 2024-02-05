import { UserAbstract } from './users.abstract';
import { UsersEntity } from './users.entity';
import { UserModel } from './users.model';
import { UsersMapper } from './users.mapper';
import { UserValidator } from './users.validator';
export * from './users.interface';

export const usersDomain = [
  UserAbstract,
  UsersEntity,
  UserModel,
  UsersMapper,
  UserValidator,
];
