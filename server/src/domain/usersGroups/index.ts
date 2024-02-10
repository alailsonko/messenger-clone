import { UserGroupAbstract } from './usersGroups.abstract';
import { UserGroupEntity } from './usersGroups.entity';
import { UserGroupModel } from './usersGroups.model';
import { UserGroupMapper } from './usersGroups.mapper';
import { UserGroupValidator } from './usersGroups.validator';
export * from './usersGroups.interface';

export const usersGroupsDomain = [
  UserGroupAbstract,
  UserGroupEntity,
  UserGroupModel,
  UserGroupMapper,
  UserGroupValidator,
];

export {
  UserGroupAbstract,
  UserGroupEntity,
  UserGroupModel,
  UserGroupMapper,
  UserGroupValidator,
};
