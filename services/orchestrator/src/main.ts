import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { protobufPackages } from './presentation/rpc/protobuf-packages';
import { ReflectionService } from '@grpc/reflection';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: [protobufPackages.orchestrator.name],
        protoPath: [protobufPackages.orchestrator.filePath],
        url: '0.0.0.0:8080',
        onLoadPackageDefinition(pkg, server) {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
