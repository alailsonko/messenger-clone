import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl';
import { UsersEntity } from 'src/domain/users/users.entity';
import { FindAllUsersQuery, FindUniqueUserQuery } from './queries/impl';
import { IUser, UsersMapper, UsersModel } from 'src/domain/users';
import { PagedResult } from 'src/common/types/paged-result.type';

@Injectable()
export class UsersService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  async createUser(data: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
  }): Promise<IUser> {
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

    return UsersMapper.toObject(userEntity);
  }

  async findUniqueUser(
    data: { email?: string; username?: string; id?: string },
    include?: {
      permissions?: boolean;
      groups?: boolean;
      AdminLogs?: boolean;
    },
  ): Promise<IUser> {
    const user = await this.queryBus.execute<FindUniqueUserQuery, UsersModel>(
      new FindUniqueUserQuery(data, include),
    );

    return UsersMapper.toObject(user);
  }

  async findAllUsers(queryOptions: {
    skip?: number;
    take?: number;
  }): Promise<PagedResult<IUser>> {
    const response = await this.queryBus.execute<
      FindAllUsersQuery,
      PagedResult<UsersModel>
    >(new FindAllUsersQuery(queryOptions));

    return {
      data: response.data.map(UsersMapper.toObject),
      count: response.count,
    };
  }
}
