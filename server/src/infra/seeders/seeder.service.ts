import { PrismaClient } from '@prisma/client';
import {
  EGroups,
  userGroupDefaultPermissions,
} from 'src/domain/groups/groups.default';
import { LoggerService } from '../logger/logger.service';
import * as fs from 'fs';
import * as path from 'path';

export class Seeder {
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
