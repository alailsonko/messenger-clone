// session.entity.ts
import { SessionAbstract } from './sessions.abstract';

export class SessionEntity extends SessionAbstract {
  protected _id: string;
  protected _sessionKey: string;
  protected _sessionData: string;
  protected _expireDate: Date;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get sessionKey(): string {
    return this._sessionKey;
  }
  set sessionKey(value: string) {
    this._sessionKey = value;
  }

  get sessionData(): string {
    return this._sessionData;
  }
  set sessionData(value: string) {
    this._sessionData = value;
  }

  get expireDate(): Date {
    return this._expireDate;
  }
  set expireDate(value: Date) {
    this._expireDate = value;
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

  public static create(data: SessionAbstract): SessionEntity {
    const entity = new SessionEntity();
    entity.id = data.id;
    entity.sessionKey = data.sessionKey;
    entity.sessionData = data.sessionData;
    entity.expireDate = data.expireDate;
    entity.createdAt = data.createdAt;
    entity.updatedAt = data.updatedAt;
    return entity;
  }

  public toObject(): SessionAbstract {
    return {
      id: this.id,
      sessionKey: this.sessionKey,
      sessionData: this.sessionData,
      expireDate: this.expireDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
