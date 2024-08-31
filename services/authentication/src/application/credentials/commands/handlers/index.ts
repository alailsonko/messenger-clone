import { CreateCredentialHandler } from './create-credential.handler';
import { ValidateCredentialHandler } from './validate-credential.handler';

export const commandHandlers = [
  CreateCredentialHandler,
  ValidateCredentialHandler,
];
