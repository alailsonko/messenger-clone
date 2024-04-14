import { Module } from '@nestjs/common';
import { UsersApplicationModule } from './users/users.module';
import { AuthApplicationModule } from './auth/auth.module';
import { AvatarsApplicationModule } from './avatars/avatars.module';

@Module({
  imports: [
    UsersApplicationModule,
    AuthApplicationModule,
    AvatarsApplicationModule,
  ],
  exports: [
    UsersApplicationModule,
    AuthApplicationModule,
    AvatarsApplicationModule,
  ],
})
export class ApplicationModule {}
