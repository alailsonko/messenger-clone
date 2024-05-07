import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAvatarCommand } from '../impl';
import { LoggerService } from 'src/infra/logger/logger.service';
import { AvatarsRepository } from 'src/domain/avatars/avatars.repository';

@CommandHandler(UpdateAvatarCommand)
export class UpdateAvatarHandler
  implements ICommandHandler<UpdateAvatarCommand>
{
  constructor(
    private readonly repository: AvatarsRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(command: UpdateAvatarCommand): Promise<void> {
    const { avatar } = command;

    this.logger.log(`Update avatar: ${avatar.url}`, {
      avatar,
    });

    await this.repository.update({
      where: {
        userId: avatar.userId,
      },
      data: { url: avatar.url },
    });
  }
}
