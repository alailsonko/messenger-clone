import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { auth } from 'src/common/rpc/generated/protos';
import { protobufPackages } from 'src/common/rpc/protobuf-packages';
import * as grpc from '@grpc/grpc-js';
import { ReasonPhrases } from 'http-status-codes';
import { CredentialsApplicationService } from 'src/application/credentials/credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly credentialApplicationService: CredentialsApplicationService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthenticationController.name);
  }

  @GrpcMethod(
    protobufPackages.authentication.service,
    protobufPackages.authentication.methods.createUsernameAndPassword,
  )
  async createUsernameAndPassword(
    data: CreateCredentialDto,
    metadata: Metadata,
    call: ServerUnaryCall<
      auth.CreateUsernameAndPasswordRequest,
      auth.CreateUsernameAndPasswordResponse
    >,
  ): Promise<auth.ICreateUsernameAndPasswordResponse> {
    const createCredentialDto = plainToClass(CreateCredentialDto, data);
    const errors = await validate(createCredentialDto);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints).join(', '))
        .join('; ');
      throw new RpcException({
        code: grpc.status.INVALID_ARGUMENT,
        message: `Validation failed: ${errorMessages}`,
        metadata,
      });
    }

    const {
      CreateUsernameAndPasswordRequest,
      CreateUsernameAndPasswordResponse,
    } = auth;

    const authModel = new CreateUsernameAndPasswordRequest(data);

    const isNotValidRequest =
      CreateUsernameAndPasswordRequest.verify(authModel);

    if (isNotValidRequest) {
      throw new RpcException({
        code: grpc.status.INVALID_ARGUMENT,
        message: ReasonPhrases.BAD_REQUEST,
        metadata,
      });
    }

    const credential = await this.credentialApplicationService.createCredential(
      {
        username: authModel.username,
        passwordHash: authModel.password,
      },
    );

    const response = new CreateUsernameAndPasswordResponse({
      clientId: credential.id,
    });

    const isNotValidResponse =
      CreateUsernameAndPasswordResponse.verify(response);

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
