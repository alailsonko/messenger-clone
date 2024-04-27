import { IAttachment } from './attachments.interface';

export abstract class AttachmentAbstract implements IAttachment {
  abstract get id(): string;

  abstract get file(): string;

  abstract get messageId(): string;

  abstract get postId(): string;

  abstract get commentId(): string;

  abstract get createdAt(): Date;

  abstract get updatedAt(): Date;
}
