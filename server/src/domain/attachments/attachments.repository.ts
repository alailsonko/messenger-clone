import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { AttachmentEntity } from './attachments.entity';
import { IAttachment } from './attachments.interface';

@Injectable()
export class AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    attachmentWhereUniqueInput: Prisma.AttachmentWhereUniqueInput,
  ) {
    const response = await this.prisma.attachment.findUnique({
      where: attachmentWhereUniqueInput,
    });

    return AttachmentEntity.create(response);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AttachmentWhereUniqueInput;
    where?: Prisma.AttachmentWhereInput;
    orderBy?: Prisma.AttachmentOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    const response = await this.prisma.attachment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    return response.map((data) => AttachmentEntity.create(data));
  }

  async create(
    data: Prisma.AttachmentCreateInput,
  ): Promise<Pick<IAttachment, 'id'>> {
    const response = await this.prisma.attachment.create({
      data,
    });

    return { id: response.id };
  }

  async update(params: {
    where: Prisma.AttachmentWhereUniqueInput;
    data: Prisma.AttachmentUpdateInput;
  }): Promise<void> {
    const { where, data } = params;
    await this.prisma.attachment.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.AttachmentWhereUniqueInput): Promise<void> {
    await this.prisma.attachment.delete({
      where,
    });
  }
}
