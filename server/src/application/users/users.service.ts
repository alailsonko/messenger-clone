import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl';
import { UsersEntity } from 'src/domain/users/users.entity';
import { CreateUserType } from './users.types';

@Injectable()
export class UsersService {
  constructor(private commandBus: CommandBus) {}

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
}
