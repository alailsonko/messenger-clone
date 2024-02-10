import { PermissionAbstract } from './permissions.abstract';
import { PermissionEntity } from './permissions.entity';
import { PermissionModel } from './permissions.model';
import { PermissionMapper } from './permissions.mapper';
import { PermissionValidator } from './permissions.validator';
export * from './permissions.interface';

export const permissionsDomain = [
  PermissionAbstract,
  PermissionEntity,
  PermissionModel,
  PermissionMapper,
  PermissionValidator,
];

export {
  PermissionAbstract,
  PermissionEntity,
  PermissionModel,
  PermissionMapper,
  PermissionValidator,
};
