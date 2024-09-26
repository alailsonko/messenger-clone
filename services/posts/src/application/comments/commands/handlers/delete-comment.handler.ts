import { CommandHandler } from '@nestjs/cqrs';
import { DeleteCommentCommand } from '../impl';
import { CommentsRepository } from 'src/data/repository/comments.repository';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler {
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(command: DeleteCommentCommand) {
    const { commentId } = command;
    return await this.commentsRepository.deleteComment({
      id: commentId,
    });
  }
}
