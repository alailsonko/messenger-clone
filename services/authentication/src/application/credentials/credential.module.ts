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
import { JwtAuthModule } from 'src/infra/auth/auth.module';

@Module({
  imports: [
    CqrsModule,
    DataModule,
    InfraModule,
    DomainModule,
    SessionModule,
    JwtAuthModule,
  ],
  providers: [
    CredentialsApplicationService,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [CredentialsApplicationService],
})
export class CredentialModule {}
