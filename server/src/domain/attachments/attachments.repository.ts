import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    attachmentWhereUniqueInput: Prisma.AttachmentWhereUniqueInput,
  ) {
    return this.prisma.attachment.findUnique({
      where: attachmentWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AttachmentWhereUniqueInput;
    where?: Prisma.AttachmentWhereInput;
    orderBy?: Prisma.AttachmentOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.attachment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.AttachmentCreateInput) {
    return this.prisma.attachment.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.AttachmentWhereUniqueInput;
    data: Prisma.AttachmentUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.attachment.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.AttachmentWhereUniqueInput) {
    return this.prisma.attachment.delete({
      where,
    });
  }
}
