import { CommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../impl';
import { CommentsRepository } from 'src/data/repository/comments.repository';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler {
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(command: CreateCommentCommand) {
    const { postId, content, userId } = command.data;
    return await this.commentsRepository.createComment({
      content,
      userId,
      post: {
        connect: {
          id: postId,
        },
      },
    });
  }
}
