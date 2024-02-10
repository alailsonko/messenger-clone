import { ContentTypeAbstract } from './contentTypes.abstract';
import { ContentTypeEntity } from './contentTypes.entity';
import { ContentTypeModel } from './contentTypes.model';
import { ContentTypeMapper } from './contentTypes.mapper';
import { ContentTypeValidator } from './contentTypes.validator';
export * from './contentTypes.interface';

export const contentTypesDomain = [
  ContentTypeAbstract,
  ContentTypeEntity,
  ContentTypeModel,
  ContentTypeMapper,
  ContentTypeValidator,
];

export {
  ContentTypeAbstract,
  ContentTypeEntity,
  ContentTypeModel,
  ContentTypeMapper,
  ContentTypeValidator,
};
