import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class MessagesRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(messageWhereUniqueInput: Prisma.MessageWhereUniqueInput) {
    return this.prisma.message.findUnique({
      where: messageWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MessageWhereUniqueInput;
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.message.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.MessageCreateInput) {
    return this.prisma.message.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.MessageUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.message.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.MessageWhereUniqueInput) {
    return this.prisma.message.delete({
      where,
    });
  }

  async count(where: Prisma.MessageWhereInput) {
    return this.prisma.message.count({
      where,
    });
  }
}
