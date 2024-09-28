import { CommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl';
import { UsersRepository } from 'src/data/repository/users.repository';
import { User } from 'prisma/client/prisma';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { data } = command;

    return this.usersRepository.createUser(data);
  }
}
