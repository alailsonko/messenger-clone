import { Module } from '@nestjs/common';
import { UsersApplicationModule } from './users';
import { CqrsModule } from '@nestjs/cqrs';
import { DataModule } from 'src/data';
import { InfraModule } from 'src/infra';

@Module({
  exports: [CqrsModule, DataModule, InfraModule, UsersApplicationModule],
  imports: [CqrsModule, DataModule, InfraModule, UsersApplicationModule],
})
export class ApplicationModule {}
