import { join } from 'path';

export enum ProtobufServiceNames {
  USERS = 'UsersService',
}

export enum UsersMethods {
  CREATE_USER = 'createUser',
}

export const protobufPackages = {
  users: {
    name: 'users',
    filePath: join(__dirname, `./../../../../rpc/proto/users/users.proto`),
    service: ProtobufServiceNames.USERS,
    methods: {
      createUser: UsersMethods.CREATE_USER,
      // findCredential: AuthenticationMethods.FIND_CREDENTIAL,
      // validateCredential: AuthenticationMethods.VALIDATE_CREDENTIAL,
      // issueToken: AuthenticationMethods.ISSUE_TOKEN,
    },
  },
};
