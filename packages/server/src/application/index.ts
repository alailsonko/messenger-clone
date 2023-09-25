import { Module } from '@nestjs/common';
import { UsersApplicationModule } from './users';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  exports: [CqrsModule, UsersApplicationModule],
  imports: [CqrsModule, UsersApplicationModule],
})
export class ApplicationModule {}
