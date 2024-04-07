import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from 'src/application/users/users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserResponse } from 'src/application/users/users.type';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'OK',
    type: CreateUserResponse,
  })
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() body: CreateUserDto): Promise<CreateUserResponse> {
    return this.usersService.createUser(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  getUsers(@Query('skip') skip: number, @Query('take') take: number) {
    return this.usersService.findAllUsers({
      skip,
      take,
    });
  }
}
