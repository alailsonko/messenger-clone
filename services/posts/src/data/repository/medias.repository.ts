import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/client/prisma';
import { PrismaService } from 'src/infra/database/postgresql/prisma.service';

@Injectable()
export class MediasRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMedia(data: Prisma.MediaCreateInput) {
    return this.prismaService.media.create({
      data,
    });
  }

  async updateMedia(
    where: Prisma.MediaWhereUniqueInput,
    data: Prisma.MediaUpdateInput,
  ) {
    return this.prismaService.media.update({
      where,
      data,
    });
  }

  async deleteMedia(where: Prisma.MediaWhereUniqueInput) {
    return this.prismaService.media.delete({
      where,
    });
  }

  async findMedia(where: Prisma.MediaWhereUniqueInput) {
    return this.prismaService.media.findUnique({
      where,
    });
  }
}
