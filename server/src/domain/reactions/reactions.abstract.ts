export abstract class ReactionAbstract {
  abstract get id(): string;
  abstract set id(value: string);

  abstract get type(): string;
  abstract set type(value: string);

  abstract get userId(): string;
  abstract set userId(value: string);

  abstract get messageId(): string;
  abstract set messageId(value: string);
}
