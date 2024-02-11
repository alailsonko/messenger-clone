import { IAdminLog } from './adminLogs.interface';
import { AdminLogsEntity } from './adminLogs.entity';
import { AdminLog } from '@prisma/client';

class AdminLogsMapper {
  static toDomain(raw: AdminLog): AdminLogsEntity {
    const entity = new AdminLogsEntity();

    entity.id = raw.id;
    entity.action = raw.action;
    entity.objectId = raw.objectId;
    entity.objectRepr = raw.objectRepr;
    entity.changeMessage = raw.changeMessage;
    entity.createdAt = raw.createdAt;
    entity.updatedAt = raw.updatedAt;
    entity.userId = raw.userId;
    entity.contentTypeId = raw.contentTypeId;

    return entity;
  }

  static toPersistence(entity: AdminLogsEntity): IAdminLog {
    return {
      id: entity.id,
      action: entity.action,
      objectId: entity.objectId,
      objectRepr: entity.objectRepr,
      changeMessage: entity.changeMessage,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      user: entity.user,
      userId: entity.userId,
      contentType: entity.contentType,
      contentTypeId: entity.contentTypeId,
    };
  }
}

export { AdminLogsMapper };
