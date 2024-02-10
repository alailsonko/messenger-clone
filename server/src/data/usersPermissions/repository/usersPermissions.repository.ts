import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, UserPermission } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class UsersPermissionsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    usersPermissionWhereUniqueInput: Prisma.UserPermissionWhereUniqueInput,
  ): Promise<UserPermission | null> {
    return this.prisma.userPermission
      .findUnique({
        where: usersPermissionWhereUniqueInput,
      })
      .catch((error) => {
        throw new BadRequestException(error);
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
    return this.prisma.userPermission
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
    data: Prisma.UserPermissionCreateInput,
  ): Promise<UserPermission> {
    return this.prisma.userPermission
      .create({
        data,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async update(params: {
    where: Prisma.UserPermissionWhereUniqueInput;
    data: Prisma.UserPermissionUpdateInput;
  }): Promise<UserPermission> {
    const { where, data } = params;
    return this.prisma.userPermission
      .update({
        data,
        where,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async delete(
    where: Prisma.UserPermissionWhereUniqueInput,
  ): Promise<UserPermission> {
    return this.prisma.userPermission
      .delete({
        where,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }
}
