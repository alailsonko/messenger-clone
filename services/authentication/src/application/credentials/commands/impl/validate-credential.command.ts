import { ValidateCredentialDto } from 'src/presentation/authentication/dto/validate-credential.dto';

export class ValidateCredentialCommand {
  constructor(public readonly data: ValidateCredentialDto) {}
}
