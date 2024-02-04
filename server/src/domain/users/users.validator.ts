import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UsersEntity } from './users.entity';
import { IUser } from './users.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';

class UserValidator {
  static async validate(user: Partial<IUser>, operation: OPERATIONS) {
    const userEntity = plainToClass(UsersEntity, user, {
      groups: [operation],
    });
    const errors = await validate(userEntity);
    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }
    return userEntity;
  }
}

export { UserValidator };
