import { Module } from '@nestjs/common';
import { CredentialModule } from './credentials/credential.module';

@Module({
  imports: [CredentialModule],
  exports: [CredentialModule],
})
export class ApplicationModule {}
