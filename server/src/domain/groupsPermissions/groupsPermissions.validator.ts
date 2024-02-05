// groupPermission.validator.ts
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GroupPermissionEntity } from './groupsPermissions.entity';
import { IGroupPermission } from './groupsPermissions.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';

export class GroupPermissionValidator {
  static async validate(
    groupPermission: Partial<IGroupPermission>,
    operation: OPERATIONS,
  ): Promise<GroupPermissionEntity> {
    const groupPermissionEntity = plainToClass(
      GroupPermissionEntity,
      groupPermission,
      {
        groups: [operation],
      },
    );
    const errors: ValidationError[] = await validate(groupPermissionEntity, {
      groups: [operation],
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints))
        .flat();
      throw new Error(messages.join(', '));
    }

    return groupPermissionEntity;
  }
}
