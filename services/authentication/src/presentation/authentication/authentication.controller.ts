import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { auth } from 'src/common/rpc/generated/protos';
import {
  AuthenticationMethods,
  ProtobufServiceNames,
} from 'src/common/rpc/protobuf-packages';
import * as grpc from '@grpc/grpc-js';
import { ReasonPhrases } from 'http-status-codes';
import { CredentialsApplicationService } from 'src/application/credentials/credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { validateDto } from 'src/common/utils/dto-validator.util';

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
}
