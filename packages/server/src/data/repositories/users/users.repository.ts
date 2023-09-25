import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  findMany(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findMany({
      where: userWhereUniqueInput,
    });
  }

  create(userCreateInput: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: userCreateInput,
    });
  }

  delete(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.delete({
      where: userWhereUniqueInput,
    });
  }

  update(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    userUpdateInput: Prisma.UserUpdateInput,
  ) {
    return this.prismaService.user.update({
      where: userWhereUniqueInput,
      data: userUpdateInput,
    });
  }
}
