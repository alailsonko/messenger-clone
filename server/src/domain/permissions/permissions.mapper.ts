// permission.mapper.ts
import { IPermission } from './permissions.interface';
import { PermissionEntity } from './permissions.entity';

export class PermissionMapper {
  static toDomain(raw: IPermission): PermissionEntity {
    const entity = new PermissionEntity();
    entity.id = raw.id;
    entity.name = raw.name;
    entity.codename = raw.codename;
    entity.contentTypes = raw.contentTypes;
    entity.groups = raw.groups;
    entity.createdAt = raw.createdAt;
    entity.updatedAt = raw.updatedAt;
    entity.userPermission = raw.userPermission;
    entity.groupPermission = raw.groupPermission;
    return entity;
  }

  static toPersistence(entity: PermissionEntity): IPermission {
    return {
      id: entity.id,
      name: entity.name,
      codename: entity.codename,
      contentTypes: entity.contentTypes,
      groups: entity.groups,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      userPermission: entity.userPermission,
      groupPermission: entity.groupPermission,
    };
  }
}
