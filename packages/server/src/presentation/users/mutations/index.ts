import { Resolver, Args, Mutation, Context } from '@nestjs/graphql';
import { signInUserInputDTO, signUpUserInputDTO } from './dto';
import { UsersService } from 'src/application/users/users.service';
import { AccessToken, Users } from 'src/domain/users/users.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/infra/auth/guards/gql.guard';

@Resolver(() => Users)
export class UsersMutationResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => Users)
  async signUpUser(@Args('input') input: signUpUserInputDTO) {
    return this.usersService.signUp(input);
  }

  @Mutation(() => AccessToken)
  @UseGuards(GqlAuthGuard)
  async signInUser(
    @Args('loginUserInput') _loginUserInput: signInUserInputDTO,
    @Context({
      transform(ctx) {
        return ctx.user;
      },
    })
    user,
  ) {
    return this.usersService.signIn(user);
  }
}
