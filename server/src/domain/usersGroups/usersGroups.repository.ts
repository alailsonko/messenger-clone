import { Injectable } from '@nestjs/common';
import { Prisma, UserGroup } from '@prisma/client';
import { prisma } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class UsersGroupsRepository {
  private readonly prisma = prisma;
  constructor() {}

  async findUnique(
    usersGroupWhereUniqueInput: Prisma.UserGroupWhereUniqueInput,
  ): Promise<UserGroup | null> {
    return this.prisma.userGroup.findUnique({
      where: usersGroupWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserGroupWhereUniqueInput;
    where?: Prisma.UserGroupWhereInput;
    orderBy?: Prisma.UserGroupOrderByWithRelationInput;
  }): Promise<UserGroup[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.userGroup.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.UserGroupCreateInput): Promise<UserGroup> {
    return this.prisma.userGroup.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.UserGroupWhereUniqueInput;
    data: Prisma.UserGroupUpdateInput;
  }): Promise<UserGroup> {
    const { where, data } = params;
    return this.prisma.userGroup.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserGroupWhereUniqueInput): Promise<UserGroup> {
    return this.prisma.userGroup.delete({
      where,
    });
  }
}
