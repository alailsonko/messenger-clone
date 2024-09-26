import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSessionCommand } from '../impl';
import { SessionsRepository } from 'src/data/repository/sessions/sessions.repository';
import { Session } from '../../../../../prisma/client/prisma';

@CommandHandler(CreateSessionCommand)
export class CreateSessionHandler
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(command: CreateSessionCommand): Promise<Session> {
    const { data } = command;

    const session = await this.sessionsRepository.findSession({
      credentialId: data.credentialId,
    });

    if (session) {
      await this.sessionsRepository.updateSession(
        {
          credentialId: data.credentialId,
        },
        {
          refreshToken: data.refreshToken,
          token: data.token,
          expiresAt: data.expiresAt,
          ipAddress: data.ipAddress,
          lastActive: data.lastActive,
          userAgent: data.userAgent,
        },
      );
    } else {
      await this.sessionsRepository.createSession({
        refreshToken: data.refreshToken,
        token: data.token,
        expiresAt: data.expiresAt,
        credential: {
          connect: {
            id: data.credentialId,
          },
        },
        ipAddress: data.ipAddress,
        lastActive: data.lastActive,
        userAgent: data.userAgent,
      });
    }

    return session;
  }
}
