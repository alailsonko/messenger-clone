import { Exclude, plainToClass } from 'class-transformer';

export class UsersEntity {
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

  static fromPlainObject(plainObject: Record<string, any>): UsersEntity {
    return plainToClass(UsersEntity, plainObject, {
      excludeExtraneousValues: true,
    });
  }
}
