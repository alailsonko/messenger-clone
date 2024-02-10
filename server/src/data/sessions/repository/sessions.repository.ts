import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class SessionsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    sessionWhereUniqueInput: Prisma.SessionWhereUniqueInput,
  ): Promise<Session | null> {
    return this.prisma.session
      .findUnique({
        where: sessionWhereUniqueInput,
      })
      .catch((error) => {
        throw new BadRequestException(error);
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
    return this.prisma.session
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

  async create(data: Prisma.SessionCreateInput): Promise<Session> {
    return this.prisma.session
      .create({
        data,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async update(params: {
    where: Prisma.SessionWhereUniqueInput;
    data: Prisma.SessionUpdateInput;
  }): Promise<Session> {
    const { where, data } = params;
    return this.prisma.session
      .update({
        data,
        where,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async delete(where: Prisma.SessionWhereUniqueInput): Promise<Session> {
    return this.prisma.session
      .delete({
        where,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }
}
