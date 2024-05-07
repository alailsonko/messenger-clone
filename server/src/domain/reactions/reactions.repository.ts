import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prisma } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class ReactionsRepository {
  private readonly prisma = prisma;
  constructor() {}

  async findUnique(reactionWhereUniqueInput: Prisma.ReactionWhereUniqueInput) {
    return this.prisma.reaction.findUnique({
      where: reactionWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReactionWhereUniqueInput;
    where?: Prisma.ReactionWhereInput;
    orderBy?: Prisma.ReactionOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.reaction.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.ReactionCreateInput) {
    return this.prisma.reaction.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.ReactionWhereUniqueInput;
    data: Prisma.ReactionUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.reaction.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.ReactionWhereUniqueInput) {
    return this.prisma.reaction.delete({
      where,
    });
  }
}
