// permission.mapper.ts
import { IPermission } from './permissions.interface';
import { PermissionEntity } from './permissions.entity';

export class PermissionMapper {
  static toDomain(raw: IPermission): PermissionEntity {
    const entity = new PermissionEntity();
    entity.id = raw.id;
    entity.name = raw.name;
    entity.codename = raw.codename;
    entity.contentTypeId = raw.contentTypeId;
    entity.groups = raw.groups;
    entity.createdAt = raw.createdAt;
    entity.updatedAt = raw.updatedAt;
    entity.users = raw.users;

    return entity;
  }

  static toPersistence(entity: PermissionEntity): IPermission {
    return {
      id: entity.id,
      name: entity.name,
      codename: entity.codename,
      contentTypeId: entity.contentTypeId,
      groups: entity.groups,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      users: entity.users,
    };
  }

  static toObject(entity: PermissionEntity): IPermission {
    return {
      id: entity.id,
      name: entity.name,
      codename: entity.codename,
      contentTypeId: entity.contentTypeId,
      groups: entity.groups,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      users: entity.users,
    };
  }
}
