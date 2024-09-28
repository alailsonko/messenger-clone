import { auth } from '@messenger-clone/rpc/gen/ts/authentication/authentication';
import { users } from '@messenger-clone/rpc/gen/ts/users/users';
import { Injectable } from '@nestjs/common';
import { access } from 'fs';
import { AuthenticationClient } from 'src/data/clients/authentication/authentication.client';
import { UsersClient } from 'src/data/clients/users/users.client';

@Injectable()
export class UserService {
  constructor(
    private readonly authenticationClient: AuthenticationClient,
    private readonly usersClient: UsersClient,
  ) {}

  async signUp(data: { password: string; username: string; email: string }) {
    const createCredentialRequest = new auth.CreateCredentialRequest(data);
    const createCredentialResponse =
      await this.authenticationClient.createCredential(createCredentialRequest);

    const createUserRequest = new users.CreateUserRequest({
      clientId: createCredentialResponse.clientId,
      username: data.username,
      email: data.email,
    });

    await this.usersClient.createUser(createUserRequest);

    const issueTokenRequest = new auth.IssueTokenRequest({
      password: data.password,
      username: data.username,
    });
    const tokens =
      await this.authenticationClient.issueToken(issueTokenRequest);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
