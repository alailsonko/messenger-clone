import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controlller';
import { ApplicationModule } from 'src/application/application.module';
import { DataModule } from 'src/data/data.module';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [ApplicationModule, DataModule, InfraModule],
  controllers: [UsersController],
  exports: [],
})
export class PresentationModule {}
