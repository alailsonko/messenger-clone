import { Injectable } from '@nestjs/common';
import { Prisma, User, UserChatRoom } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { prisma } from 'src/infra/db/prisma/prisma.service';
import { ChatRoomEntity } from './chat-rooms.entity';
import { IChatRoom } from './chat-rooms.interface';

@Injectable()
export class ChatRoomsRepository {
  private readonly prisma = prisma;
  constructor() {}

  async findUnique(params: {
    where: Prisma.ChatRoomWhereUniqueInput;
    include?: Prisma.ChatRoomInclude<DefaultArgs>;
  }): Promise<ChatRoomEntity | null> {
    const { where, include } = params;
    const response = await this.prisma.chatRoom.findUnique({
      where,
      include,
    });

    if (!response) return null;

    return ChatRoomEntity.create({
      id: response.id,
      name: response.name,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      messages: response.messages ? response.messages : [],
      usersChatRooms: response.usersChatRooms
        ? (response.usersChatRooms as unknown as (UserChatRoom & {
            user: User;
          })[])
        : [],
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ChatRoomWhereUniqueInput;
    where?: Prisma.ChatRoomWhereInput;
    orderBy?: Prisma.ChatRoomOrderByWithRelationInput;
    include?: Prisma.ChatRoomInclude<DefaultArgs>;
  }): Promise<ChatRoomEntity[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    const response = await this.prisma.chatRoom.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });

    return response.map((data) =>
      ChatRoomEntity.create({
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        messages: data.messages ? data.messages : [],
        usersChatRooms: data.usersChatRooms
          ? (data.usersChatRooms as unknown as (UserChatRoom & {
              user: User;
            })[])
          : [],
      }),
    );
  }

  async create(
    data: Prisma.ChatRoomCreateInput,
  ): Promise<Pick<IChatRoom, 'id'>> {
    const response = await this.prisma.chatRoom.create({
      data,
    });

    return { id: response.id };
  }

  async update(params: {
    where: Prisma.ChatRoomWhereUniqueInput;
    data: Prisma.ChatRoomUpdateInput;
  }): Promise<void> {
    const { where, data } = params;
    await this.prisma.chatRoom.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.ChatRoomWhereUniqueInput): Promise<void> {
    await this.prisma.chatRoom.delete({
      where,
    });
  }

  async count(where: Prisma.ChatRoomWhereInput): Promise<number> {
    const response = await this.prisma.chatRoom.count({
      where,
    });

    return response;
  }
}
