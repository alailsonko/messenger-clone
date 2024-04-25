import { AttachmentAbstract } from './attachments.abstract';
import { IAttachment } from './attachments.interface';

export class AttachmentEntity implements AttachmentAbstract {
  private _id: string;
  private _file: string;
  private _messageId: string;
  private _postId: string;
  private _commentId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get file(): string {
    return this._file;
  }
  set file(value: string) {
    this._file = value;
  }

  get messageId(): string {
    return this._messageId;
  }

  set messageId(value: string) {
    this._messageId = value;
  }

  get postId(): string {
    return this._postId;
  }

  set postId(value: string) {
    this._postId = value;
  }

  get commentId(): string {
    return this._commentId;
  }

  set commentId(value: string) {
    this._commentId = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  public static create(data: IAttachment): AttachmentEntity {
    const attachment = new AttachmentEntity();

    attachment.id = data.id;
    attachment.file = data.file;
    attachment.messageId = data.messageId;
    attachment.postId = data.postId;
    attachment.commentId = data.commentId;
    attachment.createdAt = data.createdAt;
    attachment.updatedAt = data.updatedAt;

    return attachment;
  }

  public toObject(): AttachmentAbstract {
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
