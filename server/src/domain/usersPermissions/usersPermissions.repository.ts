import { Injectable } from '@nestjs/common';
import { Prisma, UserPermission } from '@prisma/client';
import { prisma } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class UsersPermissionsRepository {
  private readonly prisma = prisma;
  constructor() {}

  async findUnique(
    usersPermissionWhereUniqueInput: Prisma.UserPermissionWhereUniqueInput,
  ): Promise<UserPermission | null> {
    return this.prisma.userPermission.findUnique({
      where: usersPermissionWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserPermissionWhereUniqueInput;
    where?: Prisma.UserPermissionWhereInput;
    orderBy?: Prisma.UserPermissionOrderByWithRelationInput;
  }): Promise<UserPermission[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.userPermission.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(
    data: Prisma.UserPermissionCreateInput,
  ): Promise<UserPermission> {
    return this.prisma.userPermission.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.UserPermissionWhereUniqueInput;
    data: Prisma.UserPermissionUpdateInput;
  }): Promise<UserPermission> {
    const { where, data } = params;
    return this.prisma.userPermission.update({
      data,
      where,
    });
  }

  async delete(
    where: Prisma.UserPermissionWhereUniqueInput,
  ): Promise<UserPermission> {
    return this.prisma.userPermission.delete({
      where,
    });
  }
}
