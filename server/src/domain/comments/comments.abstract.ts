import { IComment } from './comments.interface';

export abstract class CommentAbstract implements IComment {
  abstract get id(): string;

  abstract get content(): string;

  abstract get userId(): string;

  abstract get postId(): string;

  abstract get createdAt(): Date;

  abstract get updatedAt(): Date;
}
