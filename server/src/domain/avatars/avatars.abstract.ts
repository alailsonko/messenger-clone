export abstract class AvatarAbstract {
  abstract get id(): string;

  abstract get userId(): string;

  abstract get url(): string;

  abstract get createdAt(): Date;

  abstract get updatedAt(): Date;
}
