import { CreateCredentialDto } from 'src/presentation/authentication/dto/create-credential.dto';

export class CreateCredentialCommand {
  constructor(public readonly data: CreateCredentialDto) {}
}
