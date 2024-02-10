import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Permission } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class PermissionsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    permissionWhereUniqueInput: Prisma.PermissionWhereUniqueInput,
  ): Promise<Permission | null> {
    return this.prisma.permission
      .findUnique({
        where: permissionWhereUniqueInput,
      })
      .catch((error) => {
        throw new BadRequestException(error);
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
    return this.prisma.permission
      .findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async create(data: Prisma.PermissionCreateInput): Promise<Permission> {
    return this.prisma.permission
      .create({
        data,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async update(params: {
    where: Prisma.PermissionWhereUniqueInput;
    data: Prisma.PermissionUpdateInput;
  }): Promise<Permission> {
    const { where, data } = params;
    return this.prisma.permission
      .update({
        data,
        where,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async delete(where: Prisma.PermissionWhereUniqueInput): Promise<Permission> {
    return this.prisma.permission
      .delete({
        where,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }
}
