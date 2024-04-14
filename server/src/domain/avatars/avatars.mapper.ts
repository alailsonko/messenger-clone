import { Avatar } from '@prisma/client';
import { AvatarEntity } from './avatars.entity';
import { IAvatar } from './avatars.interface';
import { AvatarModel } from './avatars.model';

export class AvatarsMapper {
  static toObject(avatar: AvatarEntity): IAvatar {
    return {
      id: avatar.id,
      url: avatar.url,
      createdAt: avatar.createdAt,
      updatedAt: avatar.updatedAt,
      userId: avatar.userId,
    };
  }

  static toDomain(avatar: Avatar): AvatarEntity {
    const entity = new AvatarEntity();
    entity.id = avatar.id;
    entity.url = avatar.url;
    entity.createdAt = avatar.createdAt;
    entity.updatedAt = avatar.updatedAt;
    entity.userId = avatar.userId;
    return entity;
  }

  static toModel(avatar: Avatar): AvatarModel {
    const model = new AvatarModel();
    model.id = avatar.id;
    model.url = avatar.url;
    model.createdAt = avatar.createdAt;
    model.updatedAt = avatar.updatedAt;
    model.userId = avatar.userId;
    return model;
  }
}
