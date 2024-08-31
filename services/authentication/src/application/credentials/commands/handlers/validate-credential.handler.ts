import { CommandHandler } from '@nestjs/cqrs';
import { CredentialsRepository } from 'src/data/repository/credentials/credentials.repository';
import { HashService } from 'src/infra/cryptography/hash.service';
import { ValidateCredentialCommand } from '../impl/validate-credential.command';

@CommandHandler(ValidateCredentialCommand)
export class ValidateCredentialHandler {
  constructor(
    private readonly hashService: HashService,
    private readonly credentialsRepository: CredentialsRepository,
  ) {}

  async execute(command: ValidateCredentialCommand): Promise<boolean> {
    const { data } = command;

    const credential = await this.credentialsRepository.findCredential({
      username: data.username,
    });

    if (!credential) {
      return false;
    }

    const isPasswordValid = await this.hashService.compare(
      data.password,
      credential.passwordHash,
    );

    return isPasswordValid;
  }
}
