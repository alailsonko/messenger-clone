import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import { prisma } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class SessionsRepository {
  private readonly prisma = prisma;
  constructor() {}

  async findUnique(
    sessionWhereUniqueInput: Prisma.SessionWhereUniqueInput,
  ): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: sessionWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SessionWhereUniqueInput;
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput;
  }): Promise<Session[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.session.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.SessionCreateInput): Promise<Session> {
    return this.prisma.session.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.SessionWhereUniqueInput;
    data: Prisma.SessionUpdateInput;
  }): Promise<Session> {
    const { where, data } = params;
    return this.prisma.session.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.SessionWhereUniqueInput): Promise<Session> {
    return this.prisma.session.delete({
      where,
    });
  }
}
