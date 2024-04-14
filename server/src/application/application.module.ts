import { Module } from '@nestjs/common';
import { UsersApplicationModule } from './users/users.module';
import { AuthApplicationModule } from './auth/auth.module';
import { AvatarsApplicationModule } from './avatars/avatars.module';
import { ChatRoomsApplicationModule } from './chat-rooms/chat-rooms.module';

@Module({
  imports: [
    UsersApplicationModule,
    AuthApplicationModule,
    AvatarsApplicationModule,
    ChatRoomsApplicationModule,
  ],
  exports: [
    UsersApplicationModule,
    AuthApplicationModule,
    AvatarsApplicationModule,
    ChatRoomsApplicationModule,
  ],
})
export class ApplicationModule {}
