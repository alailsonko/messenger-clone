import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl';
import { FindAllUsersQuery, FindUniqueUserQuery } from './queries/impl';
import { IUser, UsersEntity } from 'src/domain/users';
import { PagedResult } from 'src/common/types/paged-result.type';
import { CreateAvatarCommand } from '../avatars/commands/impl';

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
  }): Promise<{ id: string }> {
    const createdUser = await this.commandBus.execute<
      CreateUserCommand,
      { id: string }
    >(
      new CreateUserCommand({
        email: data.email,
        password: data.password,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      }),
    );

    await this.commandBus.execute<CreateAvatarCommand, void>(
      new CreateAvatarCommand({
        userId: createdUser.id,
        url: 'static/avatar/default.jpg',
      }),
    );

    return createdUser;
  }

  async findUniqueUser(
    data: { email?: string; username?: string; id?: string },
    include?: {
      permissions?: boolean;
      groups?: boolean;
      AdminLogs?: boolean;
    },
  ): Promise<IUser> {
    const user = await this.queryBus.execute<FindUniqueUserQuery, UsersEntity>(
      new FindUniqueUserQuery(data, include),
    );

    return user.toObject();
  }

  async findAllUsers(queryOptions: {
    skip?: number;
    take?: number;
    where?: {
      email?: string;
      username?: string;
      firstName?: string;
      lastName?: string;
    };
  }): Promise<PagedResult<IUser>> {
    const response = await this.queryBus.execute<
      FindAllUsersQuery,
      PagedResult<UsersEntity>
    >(new FindAllUsersQuery(queryOptions));

    return {
      data: response.data.map((user) => user.toObject()),
      count: response.count,
    };
  }
}
