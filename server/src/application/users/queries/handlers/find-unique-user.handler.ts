import { QueryHandler } from '@nestjs/cqrs';
import { FindUniqueUserQuery } from '../impl';
import { UsersMapper, UsersModel } from 'src/domain/users';
import { BadRequestException } from '@nestjs/common';
import { AdminLogsMapper } from 'src/domain/adminLogs';
import { PermissionMapper } from 'src/domain/permissions';
import { GroupMapper } from 'src/domain/groups';
import { AdminLogsRepository } from 'src/domain/adminLogs/adminLogs.repository';
import { LoggerService } from 'src/infra/logger/logger.service';
import { GroupsRepository } from 'src/domain/groups/groups.repository';
import { PermissionsRepository } from 'src/domain/permissions/permissions.repository';
import { UsersRepository } from 'src/domain/users/users.repository';
import { AvatarsRepository } from 'src/domain/avatars/avatars.repository';
import { AvatarsMapper } from 'src/domain/avatars/avatars.mapper';

@QueryHandler(FindUniqueUserQuery)
export class FindUniqueUserHandler {
  constructor(
    private readonly repository: UsersRepository,
    private readonly adminLogRepository: AdminLogsRepository,
    private readonly permissionRepository: PermissionsRepository,
    private readonly groupRepository: GroupsRepository,
    private readonly avatarRepository: AvatarsRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(FindUniqueUserHandler.name);
  }

  async execute(query: FindUniqueUserQuery): Promise<UsersModel> {
    const { findOptions, include } = query;

    this.logger.log(
      `Finding user: ${findOptions.username ?? findOptions.email ?? findOptions.id}`,
      {
        findOptions,
        include,
      },
    );

    const response = await this.repository.findUnique({
      email: findOptions.email,
      username: findOptions.username,
      id: findOptions.id,
    });

    if (!response) {
      throw new BadRequestException('User not found');
    }

    const model = UsersMapper.toModel(response);

    model.adminLogs = [];
    model.permissions = [];
    model.groups = [];

    const avatar = await this.avatarRepository.findUnique({
      userId: model.id,
    });

    model.avatar = AvatarsMapper.toDomain(avatar);

    if (include.AdminLogs) {
      const AdminLogs = await this.adminLogRepository.findAll({
        where: {
          userId: model.id,
        },
      });
      model.adminLogs = AdminLogs.map((log) => {
        return AdminLogsMapper.toDomain(log);
      });
    }

    if (include.permissions) {
      const permissions = await this.permissionRepository.findAll({
        where: {
          usersPermissions: {
            some: {
              userId: model.id,
            },
          },
        },
      });
      model.permissions = permissions.map((permission) => {
        return PermissionMapper.toDomain(permission);
      });
    }

    if (include.groups) {
      const groups = await this.groupRepository.findAll({
        where: {
          usersGroups: {
            some: {
              userId: model.id,
            },
          },
        },
      });

      model.groups = groups.map((group) => {
        return GroupMapper.toDomain(group);
      });
    }

    return model;
  }
}
