import { Module } from '@nestjs/common';
import { CredentialsApplicationService } from './credential.service';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './handlers';
import { DataModule } from 'src/data/data.module';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [CqrsModule, DataModule, InfraModule],
  providers: [CredentialsApplicationService, ...commandHandlers],
  exports: [CredentialsApplicationService],
})
export class CredentialModule {}
