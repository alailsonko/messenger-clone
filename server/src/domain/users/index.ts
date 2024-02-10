import { UserAbstract } from './users.abstract';
import { UsersEntity } from './users.entity';
import { UsersModel } from './users.model';
import { UsersMapper } from './users.mapper';
import { UserValidator } from './users.validator';
export * from './users.interface';

export const usersDomain = [
  UserAbstract,
  UsersEntity,
  UsersModel,
  UsersMapper,
  UserValidator,
];

export { UserAbstract, UsersEntity, UsersModel, UsersMapper, UserValidator };
