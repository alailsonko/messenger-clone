import { Resolver, Args, Query } from '@nestjs/graphql';
import { Users } from 'src/domain/models/users';
import { getUserInputDTO } from './dto';

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
