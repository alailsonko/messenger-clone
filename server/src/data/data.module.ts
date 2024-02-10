import { Module } from '@nestjs/common';
import { UsersRepository } from './users/repository/users.repository';
import { InfraModule } from 'src/infra/infra.module';
import { DomainModule } from 'src/domain/domain.module';
import { AdminLogsRepository } from './adminLogs/repository/adminLogs.repository';
import { ContentTypesRepository } from './contentTypes/repository/contentTypes.repository';
import { GroupsRepository } from './groups/repository/groups.repository';
import { GroupsPermissionsRepository } from './groupsPermissions/repository/groupsPermissions.repository';
import { PermissionsRepository } from './permissions/repository/permissions.repository';
import { SessionsRepository } from './sessions/repository/sessions.repository';
import { UsersGroupsRepository } from './usersGroups/repository/usersGroups.repository';
import { UsersPermissionsRepository } from './usersPermissions/repository/usersPermissions.repository';

@Module({
  imports: [InfraModule, DomainModule],
  providers: [
    UsersRepository,
    AdminLogsRepository,
    ContentTypesRepository,
    GroupsRepository,
    GroupsPermissionsRepository,
    PermissionsRepository,
    SessionsRepository,
    UsersRepository,
    UsersGroupsRepository,
    UsersPermissionsRepository,
  ],
  exports: [
    UsersRepository,
    AdminLogsRepository,
    ContentTypesRepository,
    GroupsRepository,
    GroupsPermissionsRepository,
    PermissionsRepository,
    SessionsRepository,
    UsersRepository,
    UsersGroupsRepository,
    UsersPermissionsRepository,
  ],
})
export class DataModule {}
