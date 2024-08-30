import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { CredentialsRepository } from './repository/credentials/credentials.repository';

@Module({
  imports: [InfraModule],
  providers: [CredentialsRepository],
  exports: [CredentialsRepository],
})
export class DataModule {}
