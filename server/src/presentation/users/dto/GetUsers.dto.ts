import { ApiProperty } from '@nestjs/swagger';
import { PagedResult } from 'src/common/types/paged-result.type';
import { IUser } from 'src/domain/users';

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
