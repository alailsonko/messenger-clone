// userPermission.validator.ts
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UserPermissionEntity } from './usersPermissions.entity';
import { IUserPermission } from './usersPermissions.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';

export class UserPermissionValidator {
  static async validate(
    userPermission: Partial<IUserPermission>,
    operation: OPERATIONS,
  ): Promise<UserPermissionEntity> {
    const userPermissionEntity = plainToClass(
      UserPermissionEntity,
      userPermission,
      {
        groups: [operation],
      },
    );
    const errors: ValidationError[] = await validate(userPermissionEntity, {
      groups: [operation],
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints))
        .flat();
      throw new Error(messages.join(', '));
    }

    return userPermissionEntity;
  }
}
