import { Exclude, plainToClass } from 'class-transformer';

export interface UsersAttrs {
  id: string;
  email: string;
  username: string;
  profile_image_url?: string;
  created_at: Date;
  updated_at: Date;
  password_hash: string;
}

export class UsersEntity implements UsersAttrs {
  id: string;
  email: string;
  username: string;
  profile_image_url?: string;
  created_at: Date;
  updated_at: Date;

  @Exclude()
  password_hash: string;

  constructor(partial: Partial<UsersEntity>) {
    Object.assign(this, partial);
  }

  static fromPlainObject(plainObject: UsersAttrs): UsersEntity {
    return plainToClass(UsersEntity, plainObject, {
      excludeExtraneousValues: true,
    });
  }
}
