import { CredentialEntityType } from 'src/domain/entities/credential.entity';

export class FindCredentialQuery {
  constructor(
    public readonly where: Partial<
      Pick<CredentialEntityType, 'id' | 'username'>
    >,
  ) {}
}
