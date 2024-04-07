import { Injectable } from '@nestjs/common';
import { Prisma, AdminLog } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class AdminLogsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    adminLogWhereUniqueInput: Prisma.AdminLogWhereUniqueInput,
  ): Promise<AdminLog | null> {
    return this.prisma.adminLog.findUnique({
      where: adminLogWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AdminLogWhereUniqueInput;
    where?: Prisma.AdminLogWhereInput;
    orderBy?: Prisma.AdminLogOrderByWithRelationInput;
  }): Promise<AdminLog[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.adminLog.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.AdminLogCreateInput): Promise<AdminLog> {
    return this.prisma.adminLog.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.AdminLogWhereUniqueInput;
    data: Prisma.AdminLogUpdateInput;
  }): Promise<AdminLog> {
    const { where, data } = params;
    return this.prisma.adminLog.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.AdminLogWhereUniqueInput): Promise<AdminLog> {
    return this.prisma.adminLog.delete({
      where,
    });
  }
}
