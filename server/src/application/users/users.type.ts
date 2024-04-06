export interface ICreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ICreateUserResponse {
  id: string;
  isSuperUser: boolean;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  isActive: boolean;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest implements ICreateUserRequest {
  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class CreateUserResponse implements ICreateUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  isSuperUser: boolean;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  isStaff: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  lastLogin: Date | null;
}
