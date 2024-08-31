import { QueryHandler } from '@nestjs/cqrs';
import { FindCredentialQuery } from '../impl';
import { CredentialsRepository } from 'src/data/repository/credentials/credentials.repository';
import { CredentialModel } from 'src/domain/models/credential.model';

@QueryHandler(FindCredentialQuery)
export class FindCredentialHandler {
  constructor(
    private readonly credentialModel: CredentialModel,
    private readonly credentialsRepository: CredentialsRepository,
  ) {}

  async execute(query: FindCredentialQuery): Promise<CredentialModel> {
    const { where } = query;
    const credential = await this.credentialsRepository.findCredential({
      id: where.id,
      username: where.username,
    });

    this.credentialModel.initialize(credential);

    return this.credentialModel;
  }
}
