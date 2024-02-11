import { QueryHandler } from '@nestjs/cqrs';
import { FindUniqueUserQuery } from '../impl';
import { UsersRepository } from 'src/data/users/repository/users.repository';
import { UsersMapper, UsersModel } from 'src/domain/users';
import { BadRequestException } from '@nestjs/common';
import { AdminLogsMapper } from 'src/domain/adminLogs';
import { UserPermissionMapper } from 'src/domain/usersPermissions';
import { UserGroupMapper } from 'src/domain/usersGroups';

@QueryHandler(FindUniqueUserQuery)
export class FindUniqueUserHandler {
  constructor(private readonly repository: UsersRepository) {}

  async execute(query: FindUniqueUserQuery): Promise<UsersModel> {
    try {
      const { findOptions, include } = query;

      const response = await this.repository.findUnique(
        {
          username: findOptions.username && findOptions.username,
          OR: findOptions.email && [{ email: findOptions.email }],
        },
        include,
      );

      if (!response) {
        throw new BadRequestException('User not found');
      }

      const model = UsersMapper.toModel(response);

      if (response.AdminLog && response.AdminLog.length) {
        model.adminLog = response.AdminLog.map((log) => {
          return AdminLogsMapper.toDomain(log);
        });
      }

      if (response.userPermissions && response.userPermissions.length) {
        model.userPermissions = response.userPermissions.map((permission) => {
          return UserPermissionMapper.toDomain(permission);
        });
      }

      if (response.UserGroup && response.UserGroup.length) {
        model.userGroup = response.UserGroup.map((group) => {
          return UserGroupMapper.toDomain(group);
        });
      }

      return UsersMapper.toModel(response);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
