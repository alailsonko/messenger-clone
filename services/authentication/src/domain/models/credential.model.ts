import { Injectable } from '@nestjs/common';
import { CredentialEntity } from '../entities/credential.entity';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import { HashService } from 'src/infra/cryptography/hash.service';
import { CredentialsRepository } from 'src/data/repository/credentials/credentials.repository';

@Injectable()
export class CredentialModel implements CredentialEntity {
  private _id: string;
  private _username: string;
  private _passwordHash: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _initialized = false;

  constructor(
    private readonly hashService: HashService,
    private readonly credentialRepository: CredentialsRepository,
  ) {}

  initialize(data: CredentialEntity) {
    if (this._initialized) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: 'Credential entity already initialized',
      });
    }
    this._id = data.id;
    this._username = data.username;
    this._passwordHash = data.passwordHash;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id() {
    return this._id;
  }

  get username() {
    return this._username;
  }

  get passwordHash() {
    return this._passwordHash;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  async changeUsername(username: string): Promise<void> {
    this._username = username;

    await this.credentialRepository.updateCredential(
      {
        id: this._id,
      },
      {
        username,
      },
    );
  }

  async changePassword(
    newPassword: string,
    oldPassword: string,
  ): Promise<void> {
    const canChangePassword = await this.hashService.compare(
      oldPassword,
      this._passwordHash,
    );

    if (!canChangePassword) {
      throw new RpcException({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Old password does not match',
      });
    }

    this._passwordHash = await this.hashService.hash(newPassword);

    await this.credentialRepository.updateCredential(
      {
        id: this._id,
      },
      {
        passwordHash: this._passwordHash,
      },
    );
  }

  toEntity(): CredentialEntity {
    return {
      id: this._id,
      username: this._username,
      passwordHash: this._passwordHash,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
