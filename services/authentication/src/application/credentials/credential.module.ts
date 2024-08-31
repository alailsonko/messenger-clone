import { Module } from '@nestjs/common';
import { CredentialsApplicationService } from './credential.service';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './commands/handlers';
import { DataModule } from 'src/data/data.module';
import { InfraModule } from 'src/infra/infra.module';
import { queryHandlers } from './queries/handlers';
import { DomainModule } from 'src/domain/domain.module';

@Module({
  imports: [CqrsModule, DataModule, InfraModule, DomainModule],
  providers: [
    CredentialsApplicationService,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [CredentialsApplicationService],
})
export class CredentialModule {}
