import { IsUUID, IsString, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { GroupAbstract } from './groups.abstract';
import { IPermission } from '../permissions/permissions.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';
import { IUser } from '../users';

export class GroupEntity extends GroupAbstract {
  protected _id: string;
  protected _name: string;
  protected _permissions?: IPermission[];
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _users?: IUser[];

  @IsUUID('4', { groups: [OPERATIONS.READ] })
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  @IsString({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  @IsArray({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get permissions(): IPermission[] {
    return this._permissions;
  }
  set permissions(value: IPermission[]) {
    this._permissions = value;
  }

  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(value: Date) {
    this._createdAt = value;
  }

  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get updatedAt(): Date {
    return this._updatedAt;
  }
  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  @IsArray({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get users(): IUser[] {
    return this._users;
  }
  set users(value: IUser[]) {
    this._users = value;
  }
}
