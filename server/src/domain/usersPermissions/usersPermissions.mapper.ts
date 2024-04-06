// userPermission.mapper.ts
import { UserPermission } from '@prisma/client';
import { IUserPermission } from './usersPermissions.interface';
import { UserPermissionModel } from './usersPermissions.model';

export class UserPermissionMapper {
  static toDomain(raw: UserPermission): UserPermissionModel {
    const model = new UserPermissionModel();
    model.id = raw.id;
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

  static toObejct(entity: UserPermissionModel): UserPermission {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      userId: entity.userId,
      permissionId: entity.permissionId,
    };
  }
}
