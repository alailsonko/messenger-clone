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

class UsersEntity extends UserAbstract {
  @IsOptional({ groups: [OPERATIONS.UPDATE, OPERATIONS.CREATE] })
  @IsUUID('4', {
    message: 'Invalid UUID format',
    groups: [OPERATIONS.READ],
  })
  get id(): string {
    return super.id;
  }

  set id(value: string) {
    super.id = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get isSuperUser(): boolean {
    return super.isSuperUser;
  }

  set isSuperUser(value: boolean) {
    super.isSuperUser = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get firstName(): string {
    return super.firstName;
  }

  set firstName(value: string) {
    super.firstName = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get lastName(): string {
    return super.lastName;
  }

  set lastName(value: string) {
    super.lastName = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get isStaff(): boolean {
    return super.isStaff;
  }

  set isStaff(value: boolean) {
    super.isStaff = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get isActive(): boolean {
    return super.isActive;
  }

  set isActive(value: boolean) {
    super.isActive = value;
  }

  @IsOptional({
    groups: [OPERATIONS.UPDATE],
  })
  @IsNotEmpty({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  @MinLength(4, { groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get username(): string {
    return super.username;
  }

  set username(value: string) {
    super.username = value;
  }

  @IsOptional({
    groups: [OPERATIONS.UPDATE],
  })
  @IsNotEmpty({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  @MinLength(8, { groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get password(): string {
    return super.password;
  }

  set password(value: string) {
    super.password = value;
  }

  @IsOptional({
    groups: [OPERATIONS.UPDATE],
  })
  @IsNotEmpty({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  @IsEmail({}, { groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get email(): string {
    return super.email;
  }

  set email(value: string) {
    super.email = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get createdAt(): Date {
    return super.createdAt;
  }

  set createdAt(value: Date) {
    super.createdAt = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get updatedAt(): Date {
    return super.updatedAt;
  }

  set updatedAt(value: Date) {
    super.updatedAt = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get lastLogin(): Date | null {
    return super.lastLogin;
  }

  set lastLogin(value: Date | null) {
    super.lastLogin = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get userPermissions(): IUserPermission[] {
    return super.userPermissions;
  }

  set userPermissions(value: IUserPermission[]) {
    super.userPermissions = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get userGroup(): IUserGroup[] {
    return super.userGroup;
  }

  set userGroup(value: IUserGroup[]) {
    super.userGroup = value;
  }

  @IsOptional({
    groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE, OPERATIONS.READ],
  })
  get adminLog(): IAdminLog[] {
    return super.adminLog;
  }

  set adminLog(value: IAdminLog[]) {
    super.adminLog = value;
  }
}

export { UsersEntity };
