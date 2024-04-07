export abstract class MessageAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get content(): string;
  abstract set content(value: string);

  abstract get senderId(): string;
  abstract set senderId(value: string);

  abstract get chatRoomId(): string;
  abstract set chatRoomId(value: string);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);
}
