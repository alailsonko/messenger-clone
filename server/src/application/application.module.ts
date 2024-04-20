import { Module } from '@nestjs/common';
import { UsersApplicationModule } from './users/users.module';
import { AuthApplicationModule } from './auth/auth.module';
import { AvatarsApplicationModule } from './avatars/avatars.module';
import { ChatRoomsApplicationModule } from './chat-rooms/chat-rooms.module';
import { MessagesApplicationModule } from './messages/messages.module';

@Module({
  imports: [
    UsersApplicationModule,
    AuthApplicationModule,
    AvatarsApplicationModule,
    ChatRoomsApplicationModule,
    MessagesApplicationModule,
  ],
  exports: [
    UsersApplicationModule,
    AuthApplicationModule,
    AvatarsApplicationModule,
    ChatRoomsApplicationModule,
    MessagesApplicationModule,
  ],
})
export class ApplicationModule {}
