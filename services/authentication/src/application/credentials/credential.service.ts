import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCredentialCommand } from './impl';
import { CreateCredentialDto } from 'src/presentation/authentication/dto/create-credential.dto';

@Injectable()
export class CredentialsApplicationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createCredential(data: CreateCredentialDto) {
    return this.commandBus.execute(new CreateCredentialCommand(data));
  }
}
