import { Module } from '@nestjs/common';
import { UsersApplicationModule } from './users/users.module';

@Module({
  imports: [UsersApplicationModule],
  exports: [UsersApplicationModule],
})
export class ApplicationModule {}
