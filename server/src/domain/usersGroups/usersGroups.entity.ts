// userGroup.entity.ts
import { IGroup } from '../groups/groups.interface';
import { IUser } from '../users/users.interface';
import { UserGroupAbstract } from './usersGroups.abstract';
import { IUserGroup } from './usersGroups.interface';

export class UserGroupEntity extends UserGroupAbstract {
  protected _id: string;
  protected _user: IUser;
  protected _group: IGroup;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _userId: string;
  protected _groupId: string;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get user(): IUser {
    return this._user;
  }
  set user(value: IUser) {
    this._user = value;
  }

  get group(): IGroup {
    return this._group;
  }
  set group(value: IGroup) {
    this._group = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  get groupId(): string {
    return this._groupId;
  }
  set groupId(value: string) {
    this._groupId = value;
  }

  public static create(data: UserGroupAbstract): UserGroupEntity {
    const entity = new UserGroupEntity();
    const { id, user, group, createdAt, updatedAt, userId, groupId } = data;

    entity.id = id;
    entity.user = user;
    entity.group = group;
    entity.createdAt = createdAt;
    entity.updatedAt = updatedAt;
    entity.userId = userId;
    entity.groupId = groupId;

    return entity;
  }

  public toObject(): IUserGroup {
    return {
      id: this.id,
      user: this.user,
      group: this.group,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId,
      groupId: this.groupId,
    };
  }
}
