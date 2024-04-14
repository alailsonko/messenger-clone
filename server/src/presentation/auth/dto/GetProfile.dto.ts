import { ApiProperty } from '@nestjs/swagger';
import { IAdminLog } from 'src/domain/adminLogs';
import { IGroup } from 'src/domain/groups';
import { IPermission } from 'src/domain/permissions';
import { IUser } from 'src/domain/users';

export class AdminLog implements IAdminLog {
  @ApiProperty({ type: String, required: true })
  action: string;

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: String, required: true })
  changeMessage: string;

  @ApiProperty({ type: String, required: true })
  contentTypeId: string;

  @ApiProperty({ type: String, required: true })
  id: string;

  @ApiProperty({ type: String, required: true })
  objectId: string;

  @ApiProperty({ type: String, required: true })
  objectRepr: string;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;

  @ApiProperty({ type: String, required: true })
  userId: string;
}

export class Group implements IGroup {
  @ApiProperty({ type: String, required: true })
  id: string;

  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;
}

export class Permission implements IPermission {
  @ApiProperty({ type: String, required: true })
  codename: string;

  @ApiProperty({ type: String, required: true })
  contentTypeId: string;

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: String, required: true })
  id: string;

  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;
}

export class Profile implements Omit<IUser, 'password'> {
  @ApiProperty({ type: AdminLog, isArray: true, required: false })
  adminLogs?: IAdminLog[];

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: String, required: true })
  email: string;

  @ApiProperty({ type: String, required: true })
  firstName: string;

  @ApiProperty({ type: Group, isArray: true, required: false })
  groups?: IGroup[];

  @ApiProperty({ type: String, required: true })
  id: string;

  @ApiProperty({ type: Boolean, required: true })
  isActive: boolean;

  @ApiProperty({ type: Boolean, required: true })
  isStaff: boolean;

  @ApiProperty({ type: Boolean, required: true })
  isSuperUser: boolean;

  @ApiProperty({ type: Date, required: false })
  lastLogin: Date;

  @ApiProperty({ type: String, required: true })
  lastName: string;

  @ApiProperty({ type: Permission, isArray: true, required: false })
  permissions?: IPermission[];

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;

  @ApiProperty({ type: String, required: true })
  username: string;
}
