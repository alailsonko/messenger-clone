// permission.validator.ts
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PermissionEntity } from './permissions.entity';
import { IPermission } from './permissions.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';

export class PermissionValidator {
  static async validate(
    permission: Partial<IPermission>,
    operation: OPERATIONS,
  ): Promise<PermissionEntity> {
    const permissionEntity = plainToClass(PermissionEntity, permission, {
      groups: [operation],
    });
    const errors: ValidationError[] = await validate(permissionEntity, {
      groups: [operation],
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints))
        .flat();
      throw new Error(messages.join(', '));
    }

    return permissionEntity;
  }
}
