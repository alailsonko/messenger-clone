import { Resolver, Args, Query } from '@nestjs/graphql';
import { getUserInputDTO } from './dto';
import { Users } from 'src/domain/users/users.model';

@Resolver(() => Users)
export class UsersQueryResolver {
  constructor() {}

  @Query(() => Users)
  async getUser(@Args('input') input: getUserInputDTO) {
    return {
      id: input.id,
    };
  }
}
