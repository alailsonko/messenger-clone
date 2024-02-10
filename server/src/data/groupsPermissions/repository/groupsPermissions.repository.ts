import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, GroupPermission } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class GroupsPermissionsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    groupPermissionWhereUniqueInput: Prisma.GroupPermissionWhereUniqueInput,
  ): Promise<GroupPermission | null> {
    return this.prisma.groupPermission
      .findUnique({
        where: groupPermissionWhereUniqueInput,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GroupPermissionWhereUniqueInput;
    where?: Prisma.GroupPermissionWhereInput;
    orderBy?: Prisma.GroupPermissionOrderByWithRelationInput;
  }): Promise<GroupPermission[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.groupPermission
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

  async create(
    data: Prisma.GroupPermissionCreateInput,
  ): Promise<GroupPermission> {
    return this.prisma.groupPermission
      .create({
        data,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async update(params: {
    where: Prisma.GroupPermissionWhereUniqueInput;
    data: Prisma.GroupPermissionUpdateInput;
  }): Promise<GroupPermission> {
    const { where, data } = params;
    return this.prisma.groupPermission
      .update({
        data,
        where,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async delete(
    where: Prisma.GroupPermissionWhereUniqueInput,
  ): Promise<GroupPermission> {
    return this.prisma.groupPermission
      .delete({
        where,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }
}
