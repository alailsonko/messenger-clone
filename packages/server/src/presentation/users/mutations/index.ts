import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { signInUserInputDTO, signUpUserInputDTO } from './dto';
import { UsersService } from 'src/application/users/users.service';
import { Users } from 'src/domain/users/users.model';

@Resolver(() => Users)
export class UsersMutationResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => Users)
  async signUpUser(@Args('input') input: signUpUserInputDTO) {
    return this.usersService.signUp(input);
  }

  @Mutation(() => Users)
  async signInUser(@Args('input') input: signInUserInputDTO) {
    return {
      id: input.email,
    };
  }
}
