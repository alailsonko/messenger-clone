import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/client/prisma';
import { PrismaService } from 'src/infra/database/postgresql/prisma.service';

@Injectable()
export class SessionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createSession(data: Prisma.SessionCreateInput) {
    return this.prismaService.session.create({
      data,
    });
  }

  async deleteSession(where: Prisma.SessionWhereUniqueInput) {
    return this.prismaService.session.delete({
      where,
    });
  }

  async findSession(where: Prisma.SessionWhereUniqueInput) {
    return this.prismaService.session.findUnique({
      where,
    });
  }

  async findSessions(where: Prisma.SessionWhereInput) {
    return this.prismaService.session.findMany({
      where,
    });
  }

  async updateSession(
    where: Prisma.SessionWhereUniqueInput,
    data: Prisma.SessionUpdateInput,
  ) {
    return this.prismaService.session.update({
      where,
      data,
    });
  }
}
