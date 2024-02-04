import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl';
import { UsersEntity } from 'src/domain/users/users.entity';

@Injectable()
export class UsersService {
  constructor(private commandBus: CommandBus) {}

  async createUser(data: {
    email: string;
    password: string;
    username: string;
  }) {
    return this.commandBus.execute<CreateUserCommand, UsersEntity>(
      new CreateUserCommand({
        email: data.email,
        password: data.password,
        username: data.username,
      }),
    );
  }
}
