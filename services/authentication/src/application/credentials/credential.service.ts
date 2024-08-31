import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateCredentialCommand,
  ValidateCredentialCommand,
} from './commands/impl';
import { CreateCredentialDto } from 'src/presentation/authentication/dto/create-credential.dto';
import { FindCredentialQuery } from './queries/impl';
import { CredentialModel } from 'src/domain/models/credential.model';
import { CredentialEntityType } from 'src/domain/entities/credential.entity';
import { ValidateCredentialDto } from 'src/presentation/authentication/dto/validate-credential.dto';
import { IssueTokenDto } from 'src/presentation/authentication/dto/issue-token.dto';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { ReasonPhrases } from 'http-status-codes';
import * as grpc from '@grpc/grpc-js';
import { PinoLogger } from 'nestjs-pino';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { CreateSessionCommand } from '../sessions/commands/impl';

@Injectable()
export class CredentialsApplicationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CredentialsApplicationService.name);
  }

  async createCredential(data: CreateCredentialDto) {
    return this.commandBus.execute(new CreateCredentialCommand(data));
  }

  async findCredential(id: string): Promise<CredentialEntityType> {
    const model = await this.queryBus.execute<
      FindCredentialQuery,
      CredentialModel
    >(new FindCredentialQuery({ id }));

    return model.toEntity();
  }

  async validateCredential(data: ValidateCredentialDto) {
    return this.commandBus.execute<ValidateCredentialCommand, boolean>(
      new ValidateCredentialCommand(data),
    );
  }

  async issueToken(data: IssueTokenDto, metadata: grpc.Metadata) {
    const isValid = this.commandBus.execute<ValidateCredentialCommand, boolean>(
      new ValidateCredentialCommand(data),
    );

    if (!isValid) {
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    const credential = await this.queryBus.execute<
      FindCredentialQuery,
      CredentialModel
    >(new FindCredentialQuery({ username: data.username }));

    const token = await this.jwtService.signAsync(
      {
        id: credential.id,
        username: credential.username,
        grant_type: 'access_token',
      },
      {
        subject: credential.id,
        expiresIn: '180s',
        noTimestamp: false,
        notBefore: '0s',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: credential.id,
        username: credential.username,
        grant_type: 'refresh_token',
      },
      {
        subject: credential.id,
        expiresIn: '15m',
        noTimestamp: false,
        notBefore: '0s',
      },
    );

    const decodedToken = this.jwtService.decode(token, {
      json: true,
      complete: true,
    });

    const ipAddress = metadata.get('ip-address').toString();
    const userAgent = metadata.get('user-agent').toString();

    await this.commandBus.execute(
      new CreateSessionCommand({
        refreshToken: refreshToken,
        token: token,
        expiresAt: new Date(decodedToken.payload.exp),
        credentialId: credential.id,
        ipAddress: ipAddress,
        lastActive: new Date(),
        userAgent: userAgent,
      }),
    );

    return {
      accessToken: token,
      refreshToken: refreshToken,
    };
  }
}
