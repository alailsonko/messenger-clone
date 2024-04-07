export abstract class ChatRoomAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get name(): string;
  abstract set name(value: string);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);
}
