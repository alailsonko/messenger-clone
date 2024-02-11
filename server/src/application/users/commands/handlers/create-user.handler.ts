import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl';
import { UsersRepository } from 'src/data/users/repository/users.repository';
import { UsersMapper, UsersEntity } from 'src/domain/users';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(command: CreateUserCommand): Promise<UsersEntity> {
    try {
      const { user } = command;

      const response = await this.repository.create(user);

      return UsersMapper.toDomain(response);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
