import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/client/prisma';
import { PrismaService } from 'src/infra/database/postgresql/prisma.service';

@Injectable()
export class CommentsRepository {
  constructor(private prismaService: PrismaService) {}

  async createComment(data: Prisma.CommentCreateInput) {
    return this.prismaService.comment.create({
      data,
    });
  }

  async updateComment(
    where: Prisma.CommentWhereUniqueInput,
    data: Prisma.CommentUpdateInput,
  ) {
    return this.prismaService.comment.update({
      where,
      data,
    });
  }

  async deleteComment(where: Prisma.CommentWhereUniqueInput) {
    return this.prismaService.comment.delete({
      where,
    });
  }

  async findComment(where: Prisma.CommentWhereUniqueInput) {
    return this.prismaService.comment.findUnique({
      where,
    });
  }

  async findCommentsByPost(postId: string) {
    return this.prismaService.comment.findMany({
      where: {
        postId,
      },
    });
  }

  async findCommentsByUser(userId: string) {
    return this.prismaService.comment.findMany({
      where: {
        userId,
      },
    });
  }

  async findCommentsByPostAndUser(postId: string, userId: string) {
    return this.prismaService.comment.findMany({
      where: {
        postId,
        userId,
      },
    });
  }
}
