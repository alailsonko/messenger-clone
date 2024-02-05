// session.mapper.ts
import { ISession } from './sessions.interface';
import { SessionEntity } from './sessions.entity';

export class SessionMapper {
  static toDomain(raw: ISession): SessionEntity {
    const entity = new SessionEntity();
    entity.id = raw.id;
    entity.sessionKey = raw.sessionKey;
    entity.sessionData = raw.sessionData;
    entity.expireDate = raw.expireDate;
    entity.createdAt = raw.createdAt;
    entity.updatedAt = raw.updatedAt;
    return entity;
  }

  static toPersistence(entity: SessionEntity): ISession {
    return {
      id: entity.id,
      sessionKey: entity.sessionKey,
      sessionData: entity.sessionData,
      expireDate: entity.expireDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
