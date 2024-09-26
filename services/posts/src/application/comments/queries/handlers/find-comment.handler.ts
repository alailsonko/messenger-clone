import { CommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from 'src/data/repository/comments.repository';
import { FindCommentQuery } from '../impl';

@CommandHandler(FindCommentQuery)
export class FindCommentHandler {
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(query: FindCommentQuery) {
    return await this.commentsRepository.findComment({
      id: query.commentId,
    });
  }
}
