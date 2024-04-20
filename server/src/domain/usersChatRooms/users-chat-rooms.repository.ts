import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

@Injectable()
export class UsersChatRoomsRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    usersChatRoomWhereUniqueInput: Prisma.UserChatRoomWhereUniqueInput,
  ) {
    return this.prisma.userChatRoom.findUnique({
      where: usersChatRoomWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserChatRoomWhereUniqueInput;
    where?: Prisma.UserChatRoomWhereInput;
    orderBy?: Prisma.UserChatRoomOrderByWithRelationInput;
    include?: Prisma.UserChatRoomInclude<DefaultArgs>;
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.userChatRoom.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async create(data: Prisma.UserChatRoomCreateInput) {
    return this.prisma.userChatRoom.create({
      data,
    });
  }

  async createTrx(data: Prisma.UserChatRoomCreateInput[]) {
    return this.prisma.$transaction(
      data.map((d) => this.prisma.userChatRoom.create({ data: d })),
    );
  }

  async update(params: {
    where: Prisma.UserChatRoomWhereUniqueInput;
    data: Prisma.UserChatRoomUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.userChatRoom.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserChatRoomWhereUniqueInput) {
    return this.prisma.userChatRoom.delete({
      where,
    });
  }
}
