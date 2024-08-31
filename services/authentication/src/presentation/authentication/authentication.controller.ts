import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { auth } from 'src/presentation/rpc/generated/protos';
import {
  AuthenticationMethods,
  ProtobufServiceNames,
} from '../../presentation/rpc/protobuf-packages';
import * as grpc from '@grpc/grpc-js';
import { ReasonPhrases } from 'http-status-codes';
import { CredentialsApplicationService } from '../../application/credentials/credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { validateDto } from 'src/common/utils/dto-validator.util';
import { ValidateCredentialDto } from './dto/validate-credential.dto';
import * as zlib from 'zlib';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly credentialApplicationService: CredentialsApplicationService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthenticationController.name);
  }

  @GrpcMethod(
    ProtobufServiceNames.AUTHENTICATION,
    AuthenticationMethods.CREATE_CREDENTIAL,
  )
  async createCredential(
    data: CreateCredentialDto,
    metadata: Metadata,
    call: ServerUnaryCall<
      auth.CreateCredentialRequest,
      auth.CreateCredentialResponse
    >,
  ): Promise<auth.ICreateCredentialResponse> {
    await validateDto(CreateCredentialDto, data, metadata);

    const { CreateCredentialResponse } = auth;

    const credential =
      await this.credentialApplicationService.createCredential(data);

    const response = new CreateCredentialResponse({
      clientId: credential.id,
    });

    const isNotValidResponse = CreateCredentialResponse.verify(response);

    if (isNotValidResponse) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        metadata,
      });
    }

    call.sendMetadata(metadata);

    return response;
  }

  @GrpcMethod(
    ProtobufServiceNames.AUTHENTICATION,
    AuthenticationMethods.FIND_CREDENTIAL,
  )
  async findCredential(
    data: auth.FindCredentialRequest,
    metadata: Metadata,
    call: ServerUnaryCall<
      auth.FindCredentialRequest,
      auth.FindCredentialResponse
    >,
  ): Promise<auth.IFindCredentialResponse> {
    const { FindCredentialResponse } = auth;

    const credential = await this.credentialApplicationService.findCredential(
      data.id,
    );

    const response = new FindCredentialResponse({
      id: credential.id,
      username: credential.username,
      createdAt: credential.createdAt.toISOString(),
      updatedAt: credential.updatedAt.toISOString(),
    });

    const isNotValidResponse = FindCredentialResponse.verify(response);

    if (isNotValidResponse) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        metadata,
      });
    }

    call.sendMetadata(metadata);

    return response;
  }

  @GrpcMethod(
    ProtobufServiceNames.AUTHENTICATION,
    AuthenticationMethods.VALIDATE_CREDENTIAL,
  )
  async validateCredential(
    data: auth.ValidateCredentialRequest,
    metadata: Metadata,
    call: ServerUnaryCall<
      auth.ValidateCredentialRequest,
      auth.ValidateCredentialResponse
    >,
  ): Promise<auth.IValidateCredentialResponse> {
    await validateDto(ValidateCredentialDto, data, metadata);

    const { ValidateCredentialResponse } = auth;

    const isValid =
      await this.credentialApplicationService.validateCredential(data);

    const response = new ValidateCredentialResponse({
      isValid,
    });

    const isNotValidResponse = ValidateCredentialResponse.verify(response);

    if (isNotValidResponse) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        metadata,
      });
    }

    call.sendMetadata(metadata);

    return response;
  }

  @GrpcMethod(
    ProtobufServiceNames.AUTHENTICATION,
    AuthenticationMethods.ISSUE_TOKEN,
  )
  async issueToken(
    data: auth.IssueTokenRequest,
    metadata: Metadata,
    call: ServerUnaryCall<auth.IssueTokenRequest, auth.IssueTokenResponse>,
  ): Promise<auth.IIssueTokenResponse> {
    const { IssueTokenResponse } = auth;

    this.logger.info('Issuing token');

    const tokens = await this.credentialApplicationService.issueToken(
      data,
      metadata,
    );

    const accessTokenBytes = new TextEncoder().encode(tokens.accessToken);
    const refreshTokenBytes = new TextEncoder().encode(tokens.refreshToken);

    const response = new IssueTokenResponse({
      accessToken: accessTokenBytes,
      refreshToken: refreshTokenBytes,
    });

    const isNotValidResponse = IssueTokenResponse.verify(response);

    if (isNotValidResponse) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        metadata,
      });
    }

    call.sendMetadata(metadata);

    return {
      accessToken: accessTokenBytes,
      refreshToken: refreshTokenBytes,
    };
  }
}
