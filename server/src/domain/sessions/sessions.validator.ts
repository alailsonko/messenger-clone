// session.validator.ts
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SessionEntity } from './sessions.entity';
import { ISession } from './sessions.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';

export class SessionValidator {
  static async validate(
    session: Partial<ISession>,
    operation: OPERATIONS,
  ): Promise<SessionEntity> {
    const sessionEntity = plainToClass(SessionEntity, session, {
      groups: [operation],
    });
    const errors: ValidationError[] = await validate(sessionEntity, {
      groups: [operation],
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints))
        .flat();
      throw new Error(messages.join(', '));
    }

    return sessionEntity;
  }
}
