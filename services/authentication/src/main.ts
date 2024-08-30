import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  ServerGrpc,
  Transport,
} from '@nestjs/microservices';
import { protobufPackages } from './common/rpc/protobuf-packages';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: [protobufPackages.authentication.name],
        protoPath: [protobufPackages.authentication.filePath],
        url: '0.0.0.0:8080',
      },
    },
  );
  app.useLogger(app.get(Logger));

  await app.listen();
}
bootstrap();
