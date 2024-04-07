export abstract class ShareAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get userId(): string;
  abstract set userId(value: string);

  abstract get postId(): string;
  abstract set postId(value: string);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);
}
