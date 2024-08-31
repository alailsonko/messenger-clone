import { join } from 'path';

export enum ProtobufServiceNames {
  AUTHENTICATION = 'AuthService',
}

export enum AuthenticationMethods {
  CREATE_CREDENTIAL = 'createCredential',
  FIND_CREDENTIAL = 'findCredential',
  VALIDATE_CREDENTIAL = 'validateCredential',
  ISSUE_TOKEN = 'issueToken',
}

export const protobufPackages = {
  authentication: {
    name: 'auth',
    filePath: join(__dirname, `./proto/authentication.proto`),
    service: ProtobufServiceNames.AUTHENTICATION,
    methods: {
      createCredential: AuthenticationMethods.CREATE_CREDENTIAL,
      findCredential: AuthenticationMethods.FIND_CREDENTIAL,
      validateCredential: AuthenticationMethods.VALIDATE_CREDENTIAL,
      issueToken: AuthenticationMethods.ISSUE_TOKEN,
    },
  },
};
