import { Module } from '@nestjs/common';
import { ApplicationModule } from 'src/application/application.module';
import { DataModule } from 'src/data/data.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [ApplicationModule, DataModule],
  controllers: [UsersController],
  exports: [],
})
export class PresentationModule {}
