import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

export async function validateDto<T extends object>(
  dtoClass: new () => T,
  data: any,
  metadata: grpc.Metadata,
): Promise<void> {
  const dtoInstance = plainToClass(dtoClass, data);
  const errors = await validate(dtoInstance);

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
}
