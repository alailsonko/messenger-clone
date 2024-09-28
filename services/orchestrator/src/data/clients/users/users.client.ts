import { users } from '@messenger-clone/rpc/gen/ts/users/users';
import * as grpc from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersClient {
  private readonly client: users.UsersServiceClient;

  constructor() {
    this.client = new users.UsersServiceClient(
      'users:8080',
      grpc.credentials.createInsecure(),
    );
  }

  createUser(data: users.CreateUserRequest): Promise<users.CreateUserResponse> {
    return new Promise((resolve, reject) => {
      this.client.createUser(data, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}
