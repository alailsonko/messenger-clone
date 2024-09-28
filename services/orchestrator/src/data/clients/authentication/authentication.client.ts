import { auth } from '@messenger-clone/rpc/gen/ts/authentication/authentication';
import * as grpc from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationClient {
  private readonly client: auth.AuthServiceClient;

  constructor() {
    this.client = new auth.AuthServiceClient(
      'authentication:8080',
      grpc.credentials.createInsecure(),
    );
  }

  createCredential(
    data: auth.CreateCredentialRequest,
  ): Promise<auth.CreateCredentialResponse> {
    return new Promise((resolve, reject) => {
      this.client.createCredential(data, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  validateCredential(
    data: auth.ValidateCredentialRequest,
  ): Promise<auth.ValidateCredentialResponse> {
    return new Promise((resolve, reject) => {
      this.client.validateCredential(data, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  issueToken(data: auth.IssueTokenRequest): Promise<auth.IssueTokenResponse> {
    return new Promise((resolve, reject) => {
      this.client.issueToken(data, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  findCredential(
    data: auth.FindCredentialRequest,
  ): Promise<auth.FindCredentialResponse> {
    return new Promise((resolve, reject) => {
      this.client.findCredential(data, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}
