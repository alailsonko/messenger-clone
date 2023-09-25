import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpCommand } from './commands/impl';

@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async signUp(data: { email: string; password: string; username: string }) {
    const user = await this.commandBus.execute<SignUpCommand>(
      new SignUpCommand({
        email: data.email,
        username: data.username,
        password_hash: data.password,
      }),
    );
    return user;
  }
}
