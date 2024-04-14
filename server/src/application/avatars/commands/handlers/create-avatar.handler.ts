import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAvatarCommand } from '../impl';
import { LoggerService } from 'src/infra/logger/logger.service';
import { AvatarsRepository } from 'src/domain/avatars/avatars.repository';

@CommandHandler(CreateAvatarCommand)
export class CreateAvatarHandler
  implements ICommandHandler<CreateAvatarCommand>
{
  constructor(
    private readonly repository: AvatarsRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(command: CreateAvatarCommand): Promise<void> {
    const { avatar } = command;

    this.logger.log(`Creating avatar: ${avatar.url}`, {
      avatar,
    });

    await this.repository.create({
      url: avatar.url,
      user: {
        connect: {
          id: avatar.userId,
        },
      },
    });
  }
}
