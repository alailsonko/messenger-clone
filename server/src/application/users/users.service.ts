import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl';
import { UsersEntity } from 'src/domain/users/users.entity';
import { CreateUserType } from './users.types';
import { FindUniqueUserQuery } from './queries/impl';
import { UsersModel } from 'src/domain/users';

@Injectable()
export class UsersService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  createUser(data: CreateUserType) {
    return this.commandBus.execute<CreateUserCommand, UsersEntity>(
      new CreateUserCommand({
        email: data.email,
        password: data.password,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      }),
    );
  }

  findUniqueUser(data: { email?: string; username?: string }) {
    return this.queryBus.execute<FindUniqueUserQuery, UsersModel>(
      new FindUniqueUserQuery({
        email: data.email,
        username: data.username,
      }),
    );
  }
}
