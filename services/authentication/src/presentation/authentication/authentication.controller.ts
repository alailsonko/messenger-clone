import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { auth } from '@messenger-clone/rpc/gen/ts/authentication/authentication';
import {
  AuthenticationMethods,
  ProtobufServiceNames,
} from '../../presentation/rpc/protobuf-packages';
import { CredentialsApplicationService } from '../../application/credentials/credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { validateDto } from '@messenger-clone/common';
import { ValidateCredentialDto } from './dto/validate-credential.dto';
import { IssueTokenDto } from './dto/issue-token.dto';

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
  ): Promise<auth.CreateCredentialResponse> {
    await validateDto(CreateCredentialDto, data, metadata);

    const { CreateCredentialResponse } = auth;

    const credential =
      await this.credentialApplicationService.createCredential(data);

    const response = new CreateCredentialResponse({
      clientId: credential.id,
    });

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
  ): Promise<auth.FindCredentialResponse> {
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
  ): Promise<auth.ValidateCredentialResponse> {
    await validateDto(ValidateCredentialDto, data, metadata);

    const { ValidateCredentialResponse } = auth;

    const isValid =
      await this.credentialApplicationService.validateCredential(data);

    const response = new ValidateCredentialResponse({
      isValid,
    });

    call.sendMetadata(metadata);

    return response;
  }

  @GrpcMethod(
    ProtobufServiceNames.AUTHENTICATION,
    AuthenticationMethods.ISSUE_TOKEN,
  )
  async issueToken(
    data: IssueTokenDto,
    metadata: Metadata,
    call: ServerUnaryCall<auth.IssueTokenRequest, auth.IssueTokenResponse>,
  ): Promise<auth.IssueTokenResponse> {
    await validateDto(IssueTokenDto, data, metadata);

    const { IssueTokenResponse } = auth;

    const tokens = await this.credentialApplicationService.issueToken(
      data,
      metadata,
    );

    const response = new IssueTokenResponse(tokens);

    call.sendMetadata(metadata);

    return response;
  }
}
