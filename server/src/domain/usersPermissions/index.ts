import { UserPermissionAbstract } from './usersPermissions.abstract';
import { UserPermissionEntity } from './usersPermissions.entity';
import { UserPermissionModel } from './usersPermissions.model';
import { UserPermissionMapper } from './usersPermissions.mapper';
import { UserPermissionValidator } from './usersPermissions.validator';
export * from './usersPermissions.interface';

export const usersPermissionsDomain = [
  UserPermissionAbstract,
  UserPermissionEntity,
  UserPermissionModel,
  UserPermissionMapper,
  UserPermissionValidator,
];

export {
  UserPermissionAbstract,
  UserPermissionEntity,
  UserPermissionModel,
  UserPermissionMapper,
  UserPermissionValidator,
};
