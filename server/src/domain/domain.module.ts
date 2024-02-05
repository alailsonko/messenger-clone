import { Module } from '@nestjs/common';
import { sessionsDomain } from './sessions';
import { permissionsDomain } from './permissions';
import { usersDomain } from './users';
import { adminLogsDomain } from './adminLogs';
import { contentTypesDomain } from './contentTypes';
import { groupsDomain } from './groups';
import { groupPermissionsDomain } from './groupsPermissions';
import { usersGroupsDomain } from './usersGroups';
import { usersPermissionsDomain } from './usersPermissions';

@Module({
  exports: [
    ...sessionsDomain,
    ...permissionsDomain,
    ...usersDomain,
    ...adminLogsDomain,
    ...contentTypesDomain,
    ...groupsDomain,
    ...groupPermissionsDomain,
    ...usersGroupsDomain,
    ...usersPermissionsDomain,
  ],
})
export class DomainModule {}
