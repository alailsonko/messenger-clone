import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AdminLogsEntity } from './adminLogs.entity';
import { IAdminLog } from './adminLogs.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';

export class AdminLogValidator {
  static async validate(
    adminLog: Partial<IAdminLog>,
    operation: OPERATIONS,
  ): Promise<AdminLogsEntity> {
    const adminLogEntity = plainToClass(AdminLogsEntity, adminLog, {
      groups: [operation],
    });
    const errors: ValidationError[] = await validate(AdminLogsEntity, {
      groups: [operation],
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints))
        .flat();
      throw new Error(messages.join(', '));
    }

    return adminLogEntity;
  }
}
