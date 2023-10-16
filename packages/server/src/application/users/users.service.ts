import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignInCommand, SignUpCommand } from './commands/impl';
import { GetUserQuery } from './queries';
import { UsersEntity } from 'src/domain/users/users.entity';
import * as R from 'ramda';

@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  signUp(data: { email: string; password: string; username: string }) {
    return this.commandBus.execute<SignUpCommand>(
      new SignUpCommand({
        email: data.email,
        username: data.username,
        password_hash: data.password,
      }),
    );
  }

  signIn(data: { email: string; id: string; username: string }) {
    return this.commandBus.execute<
      SignInCommand,
      {
        access_token: string;
      }
    >(
      new SignInCommand({
        email: data.email,
        username: data.username,
        id: data.id,
      }),
    );
  }

  getUser(findOpts: { id?: string; email?: string; username?: string }) {
    if (R.isEmpty(findOpts)) {
      throw new Error('missing parameter: id or email or username');
    }
    return this.queryBus.execute<GetUserQuery, UsersEntity>(
      new GetUserQuery(findOpts),
    );
  }
}
