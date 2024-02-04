import { IGroup } from './groups.interface';
import { GroupEntity } from './groups.entity';

export class GroupMapper {
  static toDomain(raw: IGroup): GroupEntity {
    const entity = new GroupEntity();

    entity.id = raw.id;
    entity.name = raw.name;
    entity.permissions = raw.permissions;
    entity.createdAt = raw.createdAt;
    entity.updatedAt = raw.updatedAt;
    entity.groupPermission = raw.groupPermission;
    entity.userGroup = raw.userGroup;

    return entity;
  }

  static toPersistence(entity: GroupEntity): IGroup {
    return {
      id: entity.id,
      name: entity.name,
      permissions: entity.permissions,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      groupPermission: entity.groupPermission,
      userGroup: entity.userGroup,
    };
  }
}
