// contentTypes.mapper.ts
import { IContentType } from './contentTypes.interface';
import { ContentTypeEntity } from './contentTypes.entity';

export class ContentTypeMapper {
  static toDomain(raw: IContentType): ContentTypeEntity {
    const entity = new ContentTypeEntity();

    entity.id = raw.id;
    entity.appLabel = raw.appLabel;
    entity.model = raw.model;
    entity.name = raw.name;
    entity.createdAt = raw.createdAt;
    entity.updatedAt = raw.updatedAt;
    entity.permission = raw.permission;
    entity.permissionId = raw.permissionId;
    entity.adminLog = raw.adminLog;

    return entity;
  }

  static toPersistence(entity: ContentTypeEntity): IContentType {
    return {
      id: entity.id,
      appLabel: entity.appLabel,
      model: entity.model,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      permission: entity.permission,
      permissionId: entity.permissionId,
      adminLog: entity.adminLog,
    };
  }
}
