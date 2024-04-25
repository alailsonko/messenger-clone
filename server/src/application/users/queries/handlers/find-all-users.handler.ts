import { QueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../impl';
import { UsersEntity } from 'src/domain/users';
import { BadRequestException } from '@nestjs/common';
import { LoggerService } from 'src/infra/logger/logger.service';
import { UsersRepository } from 'src/domain/users/users.repository';
import { PagedResult } from 'src/common/types/paged-result.type';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(FindAllUsersHandler.name);
  }

  async execute(query: FindAllUsersQuery): Promise<PagedResult<UsersEntity>> {
    const { queryOptions } = query;

    this.logger.log(`Finding all users`, {
      queryOptions,
    });

    const entities = await this.repository.findAll({
      skip: queryOptions.skip,
      take: queryOptions.take,
    });

    const count = await this.repository.count({});

    if (!entities) {
      throw new BadRequestException('User not found');
    }

    const models = entities.map(UsersEntity.create);

    return {
      data: models,
      count,
    };
  }
}
