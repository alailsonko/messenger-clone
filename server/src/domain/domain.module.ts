import { Module, OnModuleInit } from '@nestjs/common';
import { AdminLogsRepository } from './adminLogs/adminLogs.repository';
import { ContentTypesRepository } from './contentTypes/contentTypes.repository';
import { GroupsRepository } from './groups/groups.repository';
import { GroupsPermissionsRepository } from './groupsPermissions/groupsPermissions.repository';
import { PermissionsRepository } from './permissions/permissions.repository';
import { SessionsRepository } from './sessions/sessions.repository';
import { UsersRepository } from './users/users.repository';
import { UsersGroupsRepository } from './usersGroups/usersGroups.repository';
import { UsersPermissionsRepository } from './usersPermissions/usersPermissions.repository';
import { InfraModule } from 'src/infra/infra.module';
import { AttachmentsRepository } from './attachments/attachments.repository';
import { ChatRoomsRepository } from './chatRooms/chat-rooms.repository';
import { CommentsRepository } from './comments/comments.repository';
import { MessagesRepository } from './messages/message.repository';
import { PostsRepository } from './posts/posts.repository';
import { ReactionsRepository } from './reactions/reactions.repository';
import { SharesRepository } from './shares/shares.repository';
import { UsersChatRoomsRepository } from './usersChatRooms/users-chat-rooms.repository';
import { AvatarsRepository } from './avatars/avatars.repository';
import { Seeder } from 'src/infra/seeders/seeder.service';

@Module({
  imports: [InfraModule],
  exports: [
    UsersRepository,
    AdminLogsRepository,
    ContentTypesRepository,
    GroupsRepository,
    GroupsPermissionsRepository,
    PermissionsRepository,
    SessionsRepository,
    UsersRepository,
    UsersGroupsRepository,
    UsersPermissionsRepository,
    AttachmentsRepository,
    ChatRoomsRepository,
    CommentsRepository,
    MessagesRepository,
    PostsRepository,
    ReactionsRepository,
    SharesRepository,
    UsersChatRoomsRepository,
    AvatarsRepository,
  ],
  providers: [
    UsersRepository,
    AdminLogsRepository,
    ContentTypesRepository,
    GroupsRepository,
    GroupsPermissionsRepository,
    PermissionsRepository,
    SessionsRepository,
    UsersRepository,
    UsersGroupsRepository,
    UsersPermissionsRepository,
    AttachmentsRepository,
    ChatRoomsRepository,
    CommentsRepository,
    MessagesRepository,
    PostsRepository,
    ReactionsRepository,
    SharesRepository,
    UsersChatRoomsRepository,
    AvatarsRepository,
  ],
})
export class DomainModule extends Seeder implements OnModuleInit {
  constructor() {
    super();
  }
  async onModuleInit() {
    await this.main()
      .then(async () => {
        this.logger.log('Seeding complete');
      })
      .catch((error) => {
        this.logger.error('Error seeding', error);
      });
  }
}
