export abstract class AttachmentAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get file(): string;
  abstract set file(value: string);

  abstract get messageId(): string;
  abstract set messageId(value: string);

  abstract get postId(): string;
  abstract set postId(value: string);

  abstract get commentId(): string;
  abstract set commentId(value: string);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);
}
