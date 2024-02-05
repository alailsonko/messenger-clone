// userGroup.validator.ts
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UserGroupEntity } from './usersGroups.entity';
import { IUserGroup } from './usersGroups.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';

export class UserGroupValidator {
  static async validate(
    userGroup: Partial<IUserGroup>,
    operation: OPERATIONS,
  ): Promise<UserGroupEntity> {
    const userGroupEntity = plainToClass(UserGroupEntity, userGroup, {
      groups: [operation],
    });
    const errors: ValidationError[] = await validate(userGroupEntity, {
      groups: [operation],
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints))
        .flat();
      throw new Error(messages.join(', '));
    }

    return userGroupEntity;
  }
}
