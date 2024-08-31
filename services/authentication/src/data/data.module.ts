import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { CredentialsRepository } from './repository/credentials/credentials.repository';
import { SessionsRepository } from './repository/sessions/sessions.repository';

@Module({
  imports: [InfraModule],
  providers: [CredentialsRepository, SessionsRepository],
  exports: [CredentialsRepository, SessionsRepository],
})
export class DataModule {}
