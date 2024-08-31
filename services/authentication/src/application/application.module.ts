import { Module } from '@nestjs/common';
import { CredentialModule } from './credentials/credential.module';
import { SessionModule } from './sessions/session.module';

@Module({
  imports: [CredentialModule, SessionModule],
  exports: [CredentialModule, SessionModule],
})
export class ApplicationModule {}
