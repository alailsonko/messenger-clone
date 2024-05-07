import { Injectable } from '@nestjs/common';
import { Prisma, Permission } from '@prisma/client';
import { prisma } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class PermissionsRepository {
  private readonly prisma = prisma;
  constructor() {}

  async findUnique(
    permissionWhereUniqueInput: Prisma.PermissionWhereUniqueInput,
  ): Promise<Permission | null> {
    return this.prisma.permission.findUnique({
      where: permissionWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PermissionWhereUniqueInput;
    where?: Prisma.PermissionWhereInput;
    orderBy?: Prisma.PermissionOrderByWithRelationInput;
  }): Promise<Permission[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.permission.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.PermissionCreateInput): Promise<Permission> {
    return this.prisma.permission.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.PermissionWhereUniqueInput;
    data: Prisma.PermissionUpdateInput;
  }): Promise<Permission> {
    const { where, data } = params;
    return this.prisma.permission.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.PermissionWhereUniqueInput): Promise<Permission> {
    return this.prisma.permission.delete({
      where,
    });
  }
}
