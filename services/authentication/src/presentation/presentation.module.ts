import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication/authentication.controller';
import { ApplicationModule } from 'src/application/application.module';
import { DataModule } from 'src/data/data.module';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [ApplicationModule, DataModule, InfraModule],
  controllers: [AuthenticationController],
  providers: [],
})
export class PresentationModule {}
