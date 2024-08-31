import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CredentialsApplicationService } from './credential.service';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './commands/handlers';
import { DataModule } from 'src/data/data.module';
import { InfraModule } from 'src/infra/infra.module';
import { queryHandlers } from './queries/handlers';
import { DomainModule } from 'src/domain/domain.module';
import { SessionModule } from '../sessions/session.module';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Module({
  imports: [
    CqrsModule,
    DataModule,
    InfraModule,
    DomainModule,
    SessionModule,
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
  providers: [
    CredentialsApplicationService,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [CredentialsApplicationService],
})
export class CredentialModule {}
