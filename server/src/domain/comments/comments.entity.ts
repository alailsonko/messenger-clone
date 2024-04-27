import { CommentAbstract } from './comments.abstract';
import { IComment } from './comments.interface';

export class CommentEntity implements CommentAbstract {
  protected _id: string;
  protected _content: string;
  protected _userId: string;
  protected _postId: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  protected constructor(data: IComment) {
    this._id = data.id;
    this._content = data.content;
    this._userId = data.userId;
    this._postId = data.postId;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get content(): string {
    return this._content;
  }

  get userId(): string {
    return this._userId;
  }

  get postId(): string {
    return this._postId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public static create(data: IComment): CommentEntity {
    const entity = new CommentEntity(data);

    return entity;
  }

  public toObject(): IComment {
    return {
      id: this.id,
      content: this.content,
      userId: this.userId,
      postId: this.postId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
