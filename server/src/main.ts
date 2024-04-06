import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/errors/http-exception.filter';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const keyFile = await fs.readFile(join(__dirname, '..', '/../cert/key.pem'));
  const certFile = await fs.readFile(
    join(__dirname, '..', '/../cert/cert.pem'),
  );

  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: keyFile,
      cert: certFile,
      passphrase: '1234',
    },
  });

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
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(4000);
}
bootstrap();
