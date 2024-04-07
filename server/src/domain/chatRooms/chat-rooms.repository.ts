import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.chatRoom.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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
}
