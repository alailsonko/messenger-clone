import { Resolver, Args, Query } from '@nestjs/graphql';
import { getUserInputDTO } from './dto';
import { Users } from 'src/domain/users/users.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';
import { CurrentUser } from 'src/infra/auth/decorators/current-user.decorator';
import { UsersService } from 'src/application/users/users.service';

@Resolver(() => Users)
export class UsersQueryResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Users)
  @UseGuards(JwtAuthGuard)
  async getUser(
    @Args('input') input: getUserInputDTO,
    @CurrentUser()
    executedBy: {
      id: string;
      username: string;
      email: string;
    },
  ) {
    console.log(executedBy);
    return this.usersService.getUser(input);
  }
}
