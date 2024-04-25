import { QueryHandler } from '@nestjs/cqrs';
import { FindUniqueUserQuery } from '../impl';
import { UsersEntity } from 'src/domain/users';
import { BadRequestException } from '@nestjs/common';
import { LoggerService } from 'src/infra/logger/logger.service';
import { UsersRepository } from 'src/domain/users/users.repository';
import { AvatarsRepository } from 'src/domain/avatars/avatars.repository';

@QueryHandler(FindUniqueUserQuery)
export class FindUniqueUserHandler {
  constructor(
    private readonly repository: UsersRepository,
    private readonly avatarRepository: AvatarsRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(FindUniqueUserHandler.name);
  }

  async execute(query: FindUniqueUserQuery): Promise<UsersEntity> {
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

    const avatar = await this.avatarRepository.findUnique({
      userId: response.id,
    });

    const entity = UsersEntity.create({
      adminLogs: [],
      avatar: avatar,
      createdAt: response.createdAt,
      email: response.email,
      id: response.id,
      password: response.password,
      firstName: response.firstName,
      isActive: response.isActive,
      isStaff: response.isStaff,
      isSuperUser: response.isSuperUser,
      lastLogin: response.lastLogin,
      lastName: response.lastName,
      updatedAt: response.updatedAt,
      username: response.username,
      groups: [],
      permissions: [],
    });

    return entity;
  }
}
