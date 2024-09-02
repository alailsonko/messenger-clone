import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DataModule } from 'src/data/data.module';
import { DomainModule } from 'src/domain/domain.module';
import { InfraModule } from 'src/infra/infra.module';
import { CredentialsApplicationService } from '../credentials/credential.service';
import { commandHandlers } from './commands/handlers';
import { JwtAuthModule } from 'src/infra/auth/auth.module';

@Module({
  imports: [CqrsModule, DataModule, InfraModule, DomainModule, JwtAuthModule],
  providers: [CredentialsApplicationService, ...commandHandlers],
  exports: [CredentialsApplicationService],
})
export class SessionModule {}
