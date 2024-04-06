import { Injectable } from '@nestjs/common';
import { Prisma, Group } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class GroupsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    groupWhereUniqueInput: Prisma.GroupWhereUniqueInput,
  ): Promise<Group | null> {
    return this.prisma.group.findUnique({
      where: groupWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GroupWhereUniqueInput;
    where?: Prisma.GroupWhereInput;
    orderBy?: Prisma.GroupOrderByWithRelationInput;
  }): Promise<Group[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.group.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.GroupCreateInput): Promise<Group> {
    return this.prisma.group.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.GroupWhereUniqueInput;
    data: Prisma.GroupUpdateInput;
  }): Promise<Group> {
    const { where, data } = params;
    return this.prisma.group.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.GroupWhereUniqueInput): Promise<Group> {
    return this.prisma.group.delete({
      where,
    });
  }
}
