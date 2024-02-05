import { GroupAbstract } from './groups.abstract';
import { GroupEntity } from './groups.entity';
import { GroupModel } from './groups.model';
import { GroupMapper } from './groups.mapper';
import { GroupValidator } from './groups.validator';
export * from './groups.interface';

export const groupsDomain = [
  GroupAbstract,
  GroupEntity,
  GroupModel,
  GroupMapper,
  GroupValidator,
];
