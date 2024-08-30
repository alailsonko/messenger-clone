import { join } from 'path';

export const protobufPackages = {
  authentication: {
    name: 'auth',
    filePath: join(__dirname, `./proto/authentication.proto`),
    service: 'AuthService',
    methods: {
      createUsernameAndPassword: 'createUsernameAndPassword',
    },
  },
};
