import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/application/users/users.service';
import {
  CreateUserDto,
  CreateUserRequest,
  CreateUserResponse,
} from './dto/CreateUser.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersPagedResult } from './dto/GetUsers.dto';
import { JwtAuthGuard } from 'src/application/auth/guards/jwt-auth.guard';

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
  @ApiBody({ type: CreateUserRequest })
  createUser(@Body() body: CreateUserDto): Promise<CreateUserResponse> {
    return this.usersService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiQuery({ name: 'skip', required: true })
  @ApiQuery({ name: 'take', required: true })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: UsersPagedResult,
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  getUsers(
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('take', new ParseIntPipe()) take: number,
  ): Promise<UsersPagedResult> {
    return this.usersService.findAllUsers({
      skip,
      take,
    });
  }
}
