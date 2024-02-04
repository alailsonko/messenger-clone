import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ContentTypeEntity } from './contentTypes.entity';
import { IContentType } from './contentTypes.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';

export class ContentTypeValidator {
  static async validate(
    contentType: Partial<IContentType>,
    operation: OPERATIONS,
  ): Promise<ContentTypeEntity> {
    const contentTypeEntity = plainToClass(ContentTypeEntity, contentType, {
      groups: [operation],
    });
    const errors: ValidationError[] = await validate(contentTypeEntity, {
      groups: [operation],
    });

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints))
        .flat();
      throw new Error(messages.join(', '));
    }

    return contentTypeEntity;
  }
}
