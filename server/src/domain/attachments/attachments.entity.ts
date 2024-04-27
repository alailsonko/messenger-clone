import { AttachmentAbstract } from './attachments.abstract';
import { IAttachment } from './attachments.interface';

export class AttachmentEntity implements AttachmentAbstract {
  protected _id: string;
  protected _file: string;
  protected _messageId: string;
  protected _postId: string;
  protected _commentId: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  protected constructor(data: IAttachment) {
    this._id = data.id;
    this._file = data.file;
    this._messageId = data.messageId;
    this._postId = data.postId;
    this._commentId = data.commentId;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get file(): string {
    return this._file;
  }

  get messageId(): string {
    return this._messageId;
  }

  get postId(): string {
    return this._postId;
  }

  get commentId(): string {
    return this._commentId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public static create(data: IAttachment): AttachmentEntity {
    const attachment = new AttachmentEntity(data);

    return attachment;
  }

  public toObject(): IAttachment {
    return {
      id: this.id,
      file: this.file,
      messageId: this.messageId,
      postId: this.postId,
      commentId: this.commentId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
