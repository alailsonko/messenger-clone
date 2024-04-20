import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class ChatRoomsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(chatRoomWhereUniqueInput: Prisma.ChatRoomWhereUniqueInput) {
    return this.prisma.chatRoom.findUnique({
      where: chatRoomWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ChatRoomWhereUniqueInput;
    where?: Prisma.ChatRoomWhereInput;
    orderBy?: Prisma.ChatRoomOrderByWithRelationInput;
    include?: Prisma.ChatRoomInclude<DefaultArgs>;
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.chatRoom.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async create(data: Prisma.ChatRoomCreateInput) {
    return this.prisma.chatRoom.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.ChatRoomWhereUniqueInput;
    data: Prisma.ChatRoomUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.chatRoom.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.ChatRoomWhereUniqueInput) {
    return this.prisma.chatRoom.delete({
      where,
    });
  }

  async count(where: Prisma.ChatRoomWhereInput) {
    return this.prisma.chatRoom.count({
      where,
    });
  }
}
