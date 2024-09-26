import { CommandHandler } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../impl';
import { CommentsRepository } from 'src/data/repository/comments.repository';

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler {
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(command: UpdateCommentCommand) {
    const { commentId, data } = command;
    return await this.commentsRepository.updateComment(
      {
        id: commentId,
      },
      {
        content: data.content,
      },
    );
  }
}
