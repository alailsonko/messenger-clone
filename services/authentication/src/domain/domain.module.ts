import { Module } from '@nestjs/common';
import { DataModule } from 'src/data/data.module';
import { InfraModule } from 'src/infra/infra.module';
import { CredentialModel } from './models/credential.model';

@Module({
  imports: [DataModule, InfraModule],
  providers: [CredentialModel],
  exports: [CredentialModel],
})
export class DomainModule {}
