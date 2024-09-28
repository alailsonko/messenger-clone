import { Injectable } from '@nestjs/common';
import { Prisma, User } from '../../../prisma/client/prisma';
import { PrismaService } from 'src/infra/database/postgresql/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prismaService.user.update({
      where,
      data,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    });
  }

  async findUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.findUnique({
      where,
    });
  }
}
