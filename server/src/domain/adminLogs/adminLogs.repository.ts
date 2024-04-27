import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { AdminLogsEntity } from './adminLogs.entity';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { IAdminLog } from './adminLogs.interface';

@Injectable()
export class AdminLogsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(params: {
    where: Prisma.AdminLogWhereUniqueInput;
    include?: Prisma.AdminLogInclude<DefaultArgs>;
  }): Promise<AdminLogsEntity | null> {
    const response = await this.prisma.adminLog.findUnique({
      where: params.where,
      include: params.include,
    });

    if (!response) return null;

    return AdminLogsEntity.create({
      action: response.action,
      changeMessage: response.changeMessage,
      contentTypeId: response.contentTypeId,
      createdAt: response.createdAt,
      id: response.id,
      objectId: response.objectId,
      objectRepr: response.objectRepr,
      updatedAt: response.updatedAt,
      contentType: response.contentType ? response.contentType : null,
      user: response.user ? response.user : null,
      userId: response.userId,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AdminLogWhereUniqueInput;
    where?: Prisma.AdminLogWhereInput;
    orderBy?: Prisma.AdminLogOrderByWithRelationInput;
    include?: Prisma.AdminLogInclude<DefaultArgs>;
  }): Promise<AdminLogsEntity[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    const response = await this.prisma.adminLog.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });

    return response.map((data) =>
      AdminLogsEntity.create({
        action: data.action,
        changeMessage: data.changeMessage,
        contentTypeId: data.contentTypeId,
        createdAt: data.createdAt,
        id: data.id,
        objectId: data.objectId,
        objectRepr: data.objectRepr,
        updatedAt: data.updatedAt,
        contentType: data.contentType ? data.contentType : null,
        user: data.user ? data.user : null,
        userId: data.userId,
      }),
    );
  }

  async create(
    data: Prisma.AdminLogCreateInput,
  ): Promise<Pick<IAdminLog, 'id'>> {
    const response = await this.prisma.adminLog.create({
      data,
    });

    return {
      id: response.id,
    };
  }

  async update(params: {
    where: Prisma.AdminLogWhereUniqueInput;
    data: Prisma.AdminLogUpdateInput;
  }): Promise<void> {
    const { where, data } = params;
    await this.prisma.adminLog.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.AdminLogWhereUniqueInput): Promise<void> {
    await this.prisma.adminLog.delete({
      where,
    });
  }
}
