import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAvatarCommand } from './commands/impl';
import { join } from 'path';
import { promises as fs } from 'fs';
import { LoggerService } from 'src/infra/logger/logger.service';

@Injectable()
export class AvatarsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AvatarsService.name);
  }

  async createAvatar(data: {
    avatar: Express.Multer.File;
    userId: string;
  }): Promise<void> {
    this.logger.log('Creating avatar...');

    data.avatar.filename = `${data.userId}-${Date.now()}`;

    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'static',
      'avatar',
      data.avatar.filename + data.avatar.mimetype.replace('image/', '.'),
    );

    this.logger.log(`Writing file to ${filePath}...`);

    await fs.writeFile(filePath, data.avatar.buffer);

    const url = `static/avatar/${data.avatar.filename}${data.avatar.mimetype.replace('image/', '.')}`;

    this.logger.log(`Executing CreateAvatarCommand with URL ${url}...`);

    return this.commandBus.execute<CreateAvatarCommand, void>(
      new CreateAvatarCommand({
        userId: data.userId,
        url,
      }),
    );
  }
}
