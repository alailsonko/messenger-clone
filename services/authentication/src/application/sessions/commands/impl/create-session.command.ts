import { SessionEntityType } from 'src/domain/entities/session.entity';

export class CreateSessionCommand {
  constructor(
    public readonly data: Pick<
      SessionEntityType,
      'credentialId' | 'expiresAt' | 'lastActive' | 'refreshToken' | 'token'
    > &
      Partial<Pick<SessionEntityType, 'ipAddress' | 'userAgent'>>,
  ) {}
}
