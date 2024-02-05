// groupPermission.mapper.ts
import { IGroupPermission } from './groupsPermissions.interface';
import { GroupPermissionEntity } from './groupsPermissions.entity';

export class GroupPermissionMapper {
  static toDomain(raw: IGroupPermission): GroupPermissionEntity {
    const entity = new GroupPermissionEntity();
    entity.id = raw.id;
    entity.group = raw.group;
    entity.permission = raw.permission;
    entity.createdAt = raw.createdAt;
    entity.updatedAt = raw.updatedAt;
    entity.groupId = raw.groupId;
    entity.permissionId = raw.permissionId;
    return entity;
  }

  static toPersistence(entity: GroupPermissionEntity): IGroupPermission {
    return {
      id: entity.id,
      group: entity.group,
      permission: entity.permission,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      groupId: entity.groupId,
      permissionId: entity.permissionId,
    };
  }
}
