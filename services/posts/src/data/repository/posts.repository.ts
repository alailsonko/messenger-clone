import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/client/prisma';
import { PrismaService } from 'src/infra/database/postgresql/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(data: Prisma.PostCreateInput) {
    return this.prismaService.post.create({
      data,
    });
  }

  async updatePost(
    where: Prisma.PostWhereUniqueInput,
    data: Prisma.PostUpdateInput,
  ) {
    return this.prismaService.post.update({
      where,
      data,
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput) {
    return this.prismaService.post.delete({
      where,
    });
  }

  async findPost(where: Prisma.PostWhereUniqueInput) {
    return this.prismaService.post.findUnique({
      where,
    });
  }

  async findPostsByUser(userId: string) {
    return this.prismaService.post.findMany({
      where: {
        userId,
      },
    });
  }
}
