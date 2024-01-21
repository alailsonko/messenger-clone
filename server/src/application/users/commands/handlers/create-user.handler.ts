import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl';
import { UsersRepository } from 'src/data/users/repository/users.repository';
import { UsersEntity } from 'src/domain/users/users.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly repository: UsersRepository) {}

  execute(command: CreateUserCommand): Promise<UsersEntity> {
    const { user } = command;

    return this.repository.create(user);
  }
}
