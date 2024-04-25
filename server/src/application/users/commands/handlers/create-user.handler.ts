import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl';
import { LoggerService } from 'src/infra/logger/logger.service';
import { UsersRepository } from 'src/domain/users/users.repository';
import { UsersGroupsRepository } from 'src/domain/usersGroups/usersGroups.repository';
import { GroupsRepository } from 'src/domain/groups/groups.repository';
import { EGroups } from 'src/domain/groups/groups.default';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly UserGroupsRepository: UsersGroupsRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(CreateUserHandler.name);
  }

  async execute(command: CreateUserCommand): Promise<{ id: string }> {
    const { user } = command;

    this.logger.log(`Creating user: ${user.username}`, {
      user,
    });

    const response = await this.repository.create(user);

    const group = await this.groupsRepository.findUnique({
      name: EGroups.USER,
    });

    if (!group) {
      throw new Error('Default group not found');
    }

    await this.UserGroupsRepository.create({
      user: {
        connect: {
          id: response.id,
        },
      },
      group: {
        connect: {
          id: group.id,
        },
      },
    });

    return { id: response.id };
  }
}
