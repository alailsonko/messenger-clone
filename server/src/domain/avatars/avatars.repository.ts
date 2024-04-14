import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class AvatarsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(avatarWhereUniqueInput: Prisma.AvatarWhereUniqueInput) {
    return this.prisma.avatar.findUnique({
      where: avatarWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AvatarWhereUniqueInput;
    where?: Prisma.AvatarWhereInput;
    orderBy?: Prisma.AvatarOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.avatar.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.AvatarCreateInput) {
    return this.prisma.avatar.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.AvatarWhereUniqueInput;
    data: Prisma.AvatarUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.avatar.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.AvatarWhereUniqueInput) {
    return this.prisma.avatar.delete({
      where,
    });
  }
}
