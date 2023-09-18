import { Resolver, Args, Query } from '@nestjs/graphql';
import { Users } from 'src/domain/models/users';
import { getUserDTO } from './dto';

@Resolver(() => Users)
export class UsersResolver {
  constructor() {}

  @Query(() => Users)
  async getUser(@Args('input') input: getUserDTO) {
    return {
      input,
    };
  }
}
