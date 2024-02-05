// userPermission.mapper.ts
import { IUserPermission } from './usersPermissions.interface';
import { UserPermissionModel } from './usersPermissions.model';

export class UserPermissionMapper {
  static toDomain(raw: IUserPermission): UserPermissionModel {
    const model = new UserPermissionModel();
    model.id = raw.id;
    model.user = raw.user;
    model.permission = raw.permission;
    model.createdAt = raw.createdAt;
    model.updatedAt = raw.updatedAt;
    model.userId = raw.userId;
    model.permissionId = raw.permissionId;
    return model;
  }

  static toPersistence(entity: UserPermissionModel): IUserPermission {
    return {
      id: entity.id,
      user: entity.user,
      permission: entity.permission,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      userId: entity.userId,
      permissionId: entity.permissionId,
    };
  }
}
