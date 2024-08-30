import { Module } from '@nestjs/common';
import { CredentialsApplicationService } from './credential.service';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './handlers';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [CqrsModule, DataModule],
  providers: [CredentialsApplicationService, ...commandHandlers],
  exports: [CredentialsApplicationService],
})
export class CredentialModule {}
