import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCredentialCommand } from './impl';

@Injectable()
export class CredentialsApplicationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createCredential(data: { username: string; passwordHash: string }) {
    return this.commandBus.execute(new CreateCredentialCommand(data));
  }
}
