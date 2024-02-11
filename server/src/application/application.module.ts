import { Module } from '@nestjs/common';
import { UsersApplicationModule } from './users/users.module';
import { AuthApplicationModule } from './auth/auth.module';

@Module({
  imports: [UsersApplicationModule, AuthApplicationModule],
  exports: [UsersApplicationModule, AuthApplicationModule],
})
export class ApplicationModule {}
