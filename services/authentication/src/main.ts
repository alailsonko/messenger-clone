import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { protobufPackages } from './presentation/rpc/protobuf-packages';
import { Logger } from 'nestjs-pino';
import { ReflectionService } from '@grpc/reflection';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: [protobufPackages.authentication.name],
        protoPath: [protobufPackages.authentication.filePath],
        url: '0.0.0.0:8080',
        onLoadPackageDefinition(pkg, server) {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );
  app.useLogger(app.get(Logger));

  await app.listen();
}
bootstrap();
