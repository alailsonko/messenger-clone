import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl';
import { User } from 'prisma/client/prisma';

@Injectable()
export class UsersApplicationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createUser(data: {
    username: string;
    email: string;
    clientId: string;
  }) {
    return this.commandBus.execute<CreateUserCommand, User>(
      new CreateUserCommand(data),
    );
  }
}
