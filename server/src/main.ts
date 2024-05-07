import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/errors/http-exception.filter';
// import { promises as fs } from 'fs';
// import { join } from 'path';
import cookieParser from 'cookie-parser';
import { LoggerService } from './infra/logger/logger.service';
import { AppClusterService } from './app_cluster.service';

async function bootstrap() {
  // const keyFile = await fs.readFile(join(__dirname, '..', '/../cert/key.pem'));
  // const certFile = await fs.readFile(
  //   join(__dirname, '..', '/../cert/cert.pem'),
  // );

  // const app = await NestFactory.create(AppModule, {
  //   httpsOptions: {
  //     key: keyFile,
  //     cert: certFile,
  //     passphrase: '1234',
  //   },
  // });

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'https://localhost:3000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Messenger Clone API')
    .setDescription('The messenger clone API description')
    .setVersion('1.0')
    .addTag('mc')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: '/api-json',
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(4000, () => {
    const logger = app.get(LoggerService);

    logger.setContext('Bootstrap');
    logger.log('OPENAPI path on https://localhost:4000/api');
    logger.log('OPENAPI json path on https://localhost:4000/api-json');
    logger.log('Server is running on https://localhost:4000');
  });
}
// bootstrap();
AppClusterService.clusterize(bootstrap);
