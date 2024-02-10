import { GroupPermissionAbstract } from './groupsPermissions.abstract';
import { GroupPermissionEntity } from './groupsPermissions.entity';
import { GroupPermissionModel } from './groupsPermissions.model';
import { GroupPermissionMapper } from './groupsPermissions.mapper';
import { GroupPermissionValidator } from './groupsPermissions.validator';
export * from './groupsPermissions.interface';

export const groupPermissionsDomain = [
  GroupPermissionAbstract,
  GroupPermissionEntity,
  GroupPermissionModel,
  GroupPermissionMapper,
  GroupPermissionValidator,
];

export {
  GroupPermissionAbstract,
  GroupPermissionEntity,
  GroupPermissionModel,
  GroupPermissionMapper,
  GroupPermissionValidator,
};
