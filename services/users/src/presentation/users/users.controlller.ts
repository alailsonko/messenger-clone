import { Controller } from '@nestjs/common';
import { UsersApplicationService } from 'src/application/users/users.service';
import { users } from '@messenger-clone/rpc/gen/ts/users/users';
import { GrpcMethod } from '@nestjs/microservices';
import { ProtobufServiceNames, UsersMethods } from '../rpc/protobuf-packages';

@Controller()
export class UsersController {
  constructor(
    private readonly usersApplicationService: UsersApplicationService,
  ) {}

  @GrpcMethod(ProtobufServiceNames.USERS, UsersMethods.CREATE_USER)
  async createUser(
    data: users.CreateUserRequest,
  ): Promise<users.CreateUserResponse> {
    const user = await this.usersApplicationService.createUser(data);

    return new users.CreateUserResponse({
      id: user.id,
    });
  }
}
