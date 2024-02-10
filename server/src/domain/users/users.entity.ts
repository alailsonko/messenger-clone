import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsUUID,
  IsOptional,
  IsDate,
} from 'class-validator';
import { UserAbstract } from './users.abstract';
import { IAdminLog } from '../adminLogs/adminLogs.interface';
import { IUserGroup } from '../usersGroups/usersGroups.interface';
import { IUserPermission } from '../usersPermissions/usersPermissions.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';
import { ApiProperty } from '@nestjs/swagger';

class UsersEntity extends UserAbstract {
  protected _isSuperUser: boolean;
  protected _firstName: string;
  protected _lastName: string;
  protected _isStaff: boolean;
  protected _isActive: boolean;
  protected _userPermissions: IUserPermission[];
  protected _userGroup: IUserGroup[];
  protected _adminLog: IAdminLog[];
  protected _id: string;
  protected _username: string;
  protected _password: string;
  protected _email: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _lastLogin: Date | null;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  @IsOptional({ groups: [OPERATIONS.UPDATE, OPERATIONS.CREATE] })
  @IsUUID('4', {
    message: 'Invalid UUID format',
    groups: [OPERATIONS.READ],
  })
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  @ApiProperty({
    type: 'boolean',
  })
  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get isSuperUser(): boolean {
    return this._isSuperUser;
  }

  set isSuperUser(value: boolean) {
    this._isSuperUser = value;
  }

  @ApiProperty({
    type: 'string',
  })
  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  @ApiProperty({
    type: 'string',
  })
  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  @ApiProperty({
    type: 'boolean',
  })
  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get isStaff(): boolean {
    return this._isStaff;
  }

  set isStaff(value: boolean) {
    this._isStaff = value;
  }

  @ApiProperty({
    type: 'boolean',
  })
  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  @ApiProperty({
    type: 'string',
  })
  @IsOptional({
    groups: [OPERATIONS.UPDATE],
  })
  @IsNotEmpty({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  @MinLength(4, { groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  @ApiProperty({
    type: 'string',
  })
  @IsOptional({
    groups: [OPERATIONS.UPDATE],
  })
  @IsNotEmpty({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  @MinLength(8, { groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  @ApiProperty({
    type: 'string',
    format: 'email',
  })
  @IsOptional({
    groups: [OPERATIONS.UPDATE],
  })
  @IsNotEmpty({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  @IsEmail({}, { groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  @ApiProperty({
    type: Date,
  })
  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  @ApiProperty({
    type: Date,
  })
  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  @ApiProperty({
    type: Date,
  })
  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get lastLogin(): Date | null {
    return this._lastLogin;
  }

  set lastLogin(value: Date | null) {
    this._lastLogin = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get userPermissions(): IUserPermission[] {
    return this._userPermissions;
  }

  set userPermissions(value: IUserPermission[]) {
    this._userPermissions = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get userGroup(): IUserGroup[] {
    return this._userGroup;
  }

  set userGroup(value: IUserGroup[]) {
    this._userGroup = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get adminLog(): IAdminLog[] {
    return this._adminLog;
  }

  set adminLog(value: IAdminLog[]) {
    this._adminLog = value;
  }
}

export { UsersEntity };
