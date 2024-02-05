// userGroup.mapper.ts
import { IUserGroup } from './usersGroups.interface';
import { UserGroupModel } from './usersGroups.model';

export class UserGroupMapper {
  static toDomain(raw: IUserGroup): UserGroupModel {
    const model = new UserGroupModel();
    model.id = raw.id;
    model.user = raw.user;
    model.group = raw.group;
    model.createdAt = raw.createdAt;
    model.updatedAt = raw.updatedAt;
    model.userId = raw.userId;
    model.groupId = raw.groupId;
    return model;
  }

  static toPersistence(entity: UserGroupModel): IUserGroup {
    return {
      id: entity.id,
      user: entity.user,
      group: entity.group,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      userId: entity.userId,
      groupId: entity.groupId,
    };
  }
}
