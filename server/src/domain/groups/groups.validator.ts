import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GroupEntity } from './groups.entity';
import { IGroup } from './groups.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';

export class GroupValidator {
  static async validate(
    group: Partial<IGroup>,
    operation: OPERATIONS,
  ): Promise<GroupEntity> {
    const groupEntity = plainToClass(GroupEntity, group, {
      groups: [operation],
    });
    const errors: ValidationError[] = await validate(groupEntity, {
      groups: [operation],
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints))
        .flat();
      throw new Error(messages.join(', '));
    }

    return groupEntity;
  }
}
