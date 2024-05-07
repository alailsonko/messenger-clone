import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prisma } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class SharesRepository {
  private readonly prisma = prisma;
  constructor() {}
  async findUnique(shareWhereUniqueInput: Prisma.ShareWhereUniqueInput) {
    return this.prisma.share.findUnique({
      where: shareWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ShareWhereUniqueInput;
    where?: Prisma.ShareWhereInput;
    orderBy?: Prisma.ShareOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.share.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.ShareCreateInput) {
    return this.prisma.share.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.ShareWhereUniqueInput;
    data: Prisma.ShareUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.share.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.ShareWhereUniqueInput) {
    return this.prisma.share.delete({
      where,
    });
  }
}
