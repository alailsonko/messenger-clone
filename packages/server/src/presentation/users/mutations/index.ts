import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { Users } from 'src/domain/models/users';
import { registerUserInputDTO } from './dto';

@Resolver(() => Users)
export class UsersMutationResolver {
  constructor() {}

  @Mutation(() => Users)
  async registerUser(@Args('input') input: registerUserInputDTO) {
    return {
      id: input.email,
    };
  }
}
