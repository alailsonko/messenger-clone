import { ApiProperty } from '@nestjs/swagger';
import { PagedResult } from 'src/common/types/paged-result.type';
import { IAvatar } from 'src/domain/avatars/avatars.interface';
import { IUser } from 'src/domain/users';

export class Avatar implements IAvatar {
  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: String, required: true })
  id: string;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;

  @ApiProperty({ type: String, required: true })
  url: string;

  @ApiProperty({ type: String, required: true })
  userId: string;
}

export class Users implements IUser {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  email: string;
  @ApiProperty({
    type: 'string',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
  })
  firstName: string;
  @ApiProperty({
    type: 'boolean',
  })
  isActive: boolean;
  @ApiProperty({
    type: 'boolean',
  })
  isStaff: boolean;
  @ApiProperty({
    type: 'boolean',
  })
  isSuperUser: boolean;
  @ApiProperty({
    type: 'string',
  })
  lastLogin: Date;
  @ApiProperty({
    type: 'string',
  })
  lastName: string;
  @ApiProperty({
    type: 'string',
  })
  password: string;
  @ApiProperty({
    type: 'string',
  })
  updatedAt: Date;
  @ApiProperty({
    type: 'string',
  })
  username: string;
  @ApiProperty({
    type: Avatar,
  })
  avatar?: Avatar;
}

export class UsersPagedResult implements PagedResult<IUser> {
  @ApiProperty({
    type: Number,
    description: 'The total number of users',
  })
  count: number;
  @ApiProperty({
    type: Users,
    description: 'The list of users',
    isArray: true,
  })
  data: Users[];
}
