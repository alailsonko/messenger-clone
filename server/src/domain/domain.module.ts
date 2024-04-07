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
import { PrismaClient } from '@prisma/client';
import { InfraModule } from 'src/infra/infra.module';
import * as fs from 'fs';
import * as path from 'path';
import { EGroups, userGroupDefaultPermissions } from './groups/groups.default';
import { LoggerService } from 'src/infra/logger/logger.service';
import { AttachmentsRepository } from './attachments/attachments.repository';
import { ChatRoomsRepository } from './chatRooms/chat-rooms.repository';
import { CommentsRepository } from './comments/comments.repository';
import { MessagesRepository } from './messages/message.repository';
import { PostsRepository } from './posts/posts.repository';
import { ReactionsRepository } from './reactions/reactions.repository';
import { SharesRepository } from './shares/shares.repository';
import { UsersChatRoomsRepository } from './usersChatRooms/users-chat-rooms.repository';

class Seeder {
  public readonly prisma: PrismaClient;
  public readonly logger: LoggerService;

  constructor() {
    this.prisma = new PrismaClient();
    this.logger = new LoggerService();
  }

  async seedContentType() {
    const tableNames: { table_name: string }[] = await this.prisma
      .$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;

    for (const tableName of tableNames) {
      const contentType = await this.prisma.contentType.findFirst({
        where: {
          model: tableName.table_name,
        },
      });
      if (contentType) {
        continue;
      }
      await this.prisma.contentType.create({
        data: {
          appLabel: tableName.table_name,
          model: tableName.table_name,
          name: tableName.table_name,
        },
      });
    }
  }

  async seedPermissions() {
    const contentType = await this.prisma.contentType.findMany();
    const operations = ['read', 'add', 'change', 'delete'];

    for (const operation of operations) {
      for (const content of contentType) {
        const codename = `${operation}_${content.model}`;
        const permission = await this.prisma.permission.findFirst({
          where: {
            codename,
          },
        });
        if (permission) {
          continue;
        }
        await this.prisma.permission.create({
          data: {
            name: `Can ${operation} ${content.model}`,
            codename,
            contentTypeId: content.id,
          },
        });
      }
    }
  }

  async getContentTypesAndPermissions() {
    const contentTypes = await this.prisma.contentType.findMany({
      include: {
        permissions: true,
      },
    });

    const formattedContentTypes = contentTypes.reduce((acc, contentType) => {
      acc[contentType.model] = {
        ...contentType,
        permissions: contentType.permissions.reduce((acc, permission) => {
          acc[permission.codename] = permission;
          return acc;
        }, {}),
      };
      return acc;
    }, {});

    return formattedContentTypes;
  }

  async writeContentTypesToFile() {
    const contentTypes = await this.getContentTypesAndPermissions();
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'lib',
      'content-types.static.ts',
    );
    const fileContent = `export const ContentTypes = ${JSON.stringify(contentTypes, null, 2)};`;

    fs.writeFileSync(filePath, fileContent);
  }

  async createGroupDefaultPermissions(
    groupName: string,
    defaultPermissions: any[],
  ) {
    let group = await this.prisma.group.findFirst({
      where: {
        name: groupName,
      },
    });

    if (!group) {
      group = await this.prisma.group.create({
        data: {
          name: groupName,
        },
      });
    }

    for (const permission of defaultPermissions) {
      const content = await this.prisma.contentType.findFirst({
        where: {
          id: permission.contentTypeId,
        },
      });

      if (!content) {
        continue;
      }

      for (const permissionId of permission.permissions) {
        const permission = await this.prisma.permission.findFirst({
          where: {
            id: permissionId,
          },
        });

        if (!permission) {
          continue;
        }

        const groupPermission = await this.prisma.groupPermission.findFirst({
          where: {
            permissionId: permission.id,
            groupId: group.id,
          },
        });

        if (groupPermission) {
          continue;
        }

        await this.prisma.groupPermission.create({
          data: {
            permissionId: permission.id,
            groupId: group.id,
          },
        });

        this.logger.log(`Created default permissions for ${groupName} group`, {
          permission: permission.codename,
          group: group.name,
        });
      }
    }
  }

  async main() {
    await this.seedContentType();
    await this.seedPermissions();
    await this.writeContentTypesToFile();
    await this.createGroupDefaultPermissions(
      EGroups.USER,
      userGroupDefaultPermissions,
    );
  }
}

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
