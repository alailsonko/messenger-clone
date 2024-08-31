import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DataModule } from 'src/data/data.module';
import { DomainModule } from 'src/domain/domain.module';
import { InfraModule } from 'src/infra/infra.module';
import { CredentialsApplicationService } from '../credentials/credential.service';
import { commandHandlers } from './commands/handlers';
import { JwtModule } from '@nestjs/jwt';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Module({
  imports: [
    CqrsModule,
    DataModule,
    InfraModule,
    DomainModule,
    JwtModule.register({
      async secretOrKeyProvider(requestType, tokenOrPayload, options) {
        const privateKey = await readFile(
          join(__dirname, '../../../private/private.key'),
          'utf8',
        );

        return privateKey;
      },
      verifyOptions: {
        algorithms: ['ES256'],
        audience: 'authorization',
        issuer: 'authentication',
      },
      signOptions: {
        expiresIn: '180s',
        algorithm: 'ES256',
        audience: 'authorization',
        issuer: 'authentication',
      },
    }),
  ],
  providers: [CredentialsApplicationService, ...commandHandlers],
  exports: [CredentialsApplicationService],
})
export class SessionModule {}
