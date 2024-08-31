import { CommandHandler } from '@nestjs/cqrs';
import { CreateCredentialCommand } from '../impl';
import { CredentialsRepository } from 'src/data/repository/credentials/credentials.repository';
import { Credential } from '@prisma/client';
import { HashService } from 'src/infra/cryptography/hash.service';

@CommandHandler(CreateCredentialCommand)
export class CreateCredentialHandler {
  constructor(
    private readonly hashService: HashService,
    private readonly credentialsRepository: CredentialsRepository,
  ) {}

  async execute(command: CreateCredentialCommand): Promise<Credential> {
    const { data } = command;

    const credentialToInsert = {
      username: data.username,
      passwordHash: '',
    };

    credentialToInsert.passwordHash = await this.hashService.hash(
      data.password,
    );

    return this.credentialsRepository.createCredential(credentialToInsert);
  }
}
