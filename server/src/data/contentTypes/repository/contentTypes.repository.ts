import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, ContentType } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class ContentTypesRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    contentTypeWhereUniqueInput: Prisma.ContentTypeWhereUniqueInput,
  ): Promise<ContentType | null> {
    return this.prisma.contentType
      .findUnique({
        where: contentTypeWhereUniqueInput,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ContentTypeWhereUniqueInput;
    where?: Prisma.ContentTypeWhereInput;
    orderBy?: Prisma.ContentTypeOrderByWithRelationInput;
  }): Promise<ContentType[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.contentType
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

  async create(data: Prisma.ContentTypeCreateInput): Promise<ContentType> {
    return this.prisma.contentType
      .create({
        data,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async update(params: {
    where: Prisma.ContentTypeWhereUniqueInput;
    data: Prisma.ContentTypeUpdateInput;
  }): Promise<ContentType> {
    const { where, data } = params;
    return this.prisma.contentType
      .update({
        data,
        where,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async delete(
    where: Prisma.ContentTypeWhereUniqueInput,
  ): Promise<ContentType> {
    return this.prisma.contentType
      .delete({
        where,
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }
}
