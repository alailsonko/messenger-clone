import { join } from 'path';

export enum ProtobufServiceNames {
  AUTHENTICATION = 'AuthService',
}

export enum AuthenticationMethods {
  CREATE_CREDENTIAL = 'createCredential',
}

export const protobufPackages = {
  authentication: {
    name: 'auth',
    filePath: join(__dirname, `./proto/authentication.proto`),
    service: ProtobufServiceNames.AUTHENTICATION,
    methods: {
      createCredential: AuthenticationMethods.CREATE_CREDENTIAL,
    },
  },
};
