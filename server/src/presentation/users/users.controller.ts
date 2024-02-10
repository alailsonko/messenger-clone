import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/application/users/users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersEntity } from 'src/domain/users';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 201,
    description: 'OK',
    type: UsersEntity,
  })
  createUser(@Body() body: CreateUserDto): Promise<UsersEntity> {
    return this.usersService.createUser(body);
  }
}
