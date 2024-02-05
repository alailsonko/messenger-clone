// session.abstract.ts
export abstract class SessionAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get sessionKey(): string;
  abstract set sessionKey(value: string);

  abstract get sessionData(): string;
  abstract set sessionData(value: string);

  abstract get expireDate(): Date;
  abstract set expireDate(value: Date);

  abstract get createdAt(): Date;
  abstract set createdAt(value: Date);

  abstract get updatedAt(): Date;
  abstract set updatedAt(value: Date);
}
