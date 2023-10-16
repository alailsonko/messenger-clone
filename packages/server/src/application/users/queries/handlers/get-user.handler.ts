import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../impl';
import { UsersRepository } from 'src/data/repositories/users';
import { UsersEntity } from 'src/domain/users/users.entity';

@QueryHandler(GetUserQuery)
export class GetUserhandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(query: GetUserQuery): Promise<UsersEntity> {
    const { findOpts } = query;

    const user = await this.usersRepository.findUnique(findOpts);

    return new UsersEntity(user);
  }
}
