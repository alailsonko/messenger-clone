import { CommandHandler } from '@nestjs/cqrs';
import { CreateCredentialCommand } from '../impl';
import { CredentialsRepository } from 'src/data/repository/credentials/credentials.repository';
import { Credential } from '@prisma/client';

@CommandHandler(CreateCredentialCommand)
export class CreateCredentialHandler {
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async execute(command: CreateCredentialCommand): Promise<Credential> {
    const { data } = command;

    return this.credentialsRepository.createCredential(data);
  }
}
