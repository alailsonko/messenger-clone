import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prisma } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class CommentsRepository {
  private readonly prisma = prisma;
  constructor() {}

  async findUnique(commentWhereUniqueInput: Prisma.CommentWhereUniqueInput) {
    return this.prisma.comment.findUnique({
      where: commentWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWhereUniqueInput;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.comment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.CommentCreateInput) {
    return this.prisma.comment.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.CommentUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.comment.update({
      data,
      where,
    });
  }
  async delete(where: Prisma.CommentWhereUniqueInput) {
    return this.prisma.comment.delete({
      where,
    });
  }
}
