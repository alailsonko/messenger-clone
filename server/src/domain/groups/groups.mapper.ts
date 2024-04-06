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
    entity.permissions = raw.permissions;
    entity.users = raw.users;

    return entity;
  }

  static toPersistence(entity: GroupEntity): IGroup {
    return {
      id: entity.id,
      name: entity.name,
      permissions: entity.permissions,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      users: entity.users,
    };
  }

  static toObject(entity: GroupEntity): IGroup {
    return {
      id: entity.id,
      name: entity.name,
      permissions: entity.permissions,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      users: entity.users,
    };
  }
}
