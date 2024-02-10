import { AdminLogsAbstract } from './adminLogs.abstract';
import { AdminLogsEntity } from './adminLogs.entity';
import { AdminLogModel } from './adminLogs.model';
import { AdminLogsMapper } from './adminLogs.mapper';
import { AdminLogValidator } from './adminLogs.validator';
export * from './adminLogs.interface';

export const adminLogsDomain = [
  AdminLogsAbstract,
  AdminLogsEntity,
  AdminLogModel,
  AdminLogsMapper,
  AdminLogValidator,
];

export {
  AdminLogsAbstract,
  AdminLogsEntity,
  AdminLogModel,
  AdminLogsMapper,
  AdminLogValidator,
};
