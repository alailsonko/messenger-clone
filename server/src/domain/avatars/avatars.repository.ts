import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prisma } from 'src/infra/db/prisma/prisma.service';
import { AvatarEntity } from './avatars.entity';
import { IAvatar } from './avatars.interface';

@Injectable()
export class AvatarsRepository {
  private readonly prisma = prisma;
  constructor() {}

  async findUnique(
    avatarWhereUniqueInput: Prisma.AvatarWhereUniqueInput,
  ): Promise<AvatarEntity | null> {
    const response = await this.prisma.avatar.findUnique({
      where: avatarWhereUniqueInput,
    });

    if (!response) return null;

    return AvatarEntity.create(response);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AvatarWhereUniqueInput;
    where?: Prisma.AvatarWhereInput;
    orderBy?: Prisma.AvatarOrderByWithRelationInput;
  }): Promise<AvatarEntity[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const response = await this.prisma.avatar.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    return response.map((data) => AvatarEntity.create(data));
  }

  async create(data: Prisma.AvatarCreateInput): Promise<Pick<IAvatar, 'id'>> {
    const response = await this.prisma.avatar.create({
      data,
    });

    return { id: response.id };
  }

  async update(params: {
    where: Prisma.AvatarWhereUniqueInput;
    data: Prisma.AvatarUpdateInput;
  }): Promise<void> {
    const { where, data } = params;
    await this.prisma.avatar.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.AvatarWhereUniqueInput): Promise<void> {
    await this.prisma.avatar.delete({
      where,
    });
  }
}
