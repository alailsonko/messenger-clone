import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl';
import { UsersEntity } from 'src/domain/users/users.entity';
import { CreateUserRequest, CreateUserResponse } from './users.type';
import { FindUniqueUserQuery } from './queries/impl';
import { UsersModel } from 'src/domain/users';
import { IUsersService } from './users.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const userEntity = await this.commandBus.execute<
      CreateUserCommand,
      UsersEntity
    >(
      new CreateUserCommand({
        email: data.email,
        password: data.password,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      }),
    );

    const response: CreateUserResponse = {
      id: userEntity.id,
      email: userEntity.email,
      username: userEntity.username,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      createdAt: userEntity.createdAt,
      isActive: userEntity.isActive,
      isStaff: userEntity.isStaff,
      isSuperUser: userEntity.isSuperUser,
      lastLogin: userEntity.lastLogin,
      updatedAt: userEntity.updatedAt,
    };

    return response;
  }

  findUniqueUser(
    data: { email?: string; username?: string; id?: string },
    include?: {
      permissions?: boolean;
      groups?: boolean;
      AdminLogs?: boolean;
    },
  ) {
    return this.queryBus.execute<FindUniqueUserQuery, UsersModel>(
      new FindUniqueUserQuery(data, include),
    );
  }
}
