import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/application/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
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
import { ChatRoomsService } from 'src/application/chat-rooms/chat-rooms.service';
import { CreateUserChatRoomDto } from './dto/create-user-chat-room.dto';
import {
  ChatRoomResponseObject,
  GetUserChatRoomsResponseObject,
} from './response-object/get-user-chat-rooms.response-object';
import { MessagesService } from 'src/application/messages/messages.service';
import { PagedUserChatRoomMessages } from './dto/GetUserChatRoomMessages.dto';
import { CreateUserResponseObject } from './response-object/create-user.response-object';
import { CreateUserChatRoomResponseObject } from './response-object/create-user-chat-room.response-object';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly chatRoomsService: ChatRoomsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'OK',
    type: CreateUserResponseObject,
  })
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() body: CreateUserDto): Promise<CreateUserResponseObject> {
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

  @UseGuards(JwtAuthGuard)
  @Post(':userId/chat-rooms')
  @ApiOperation({
    summary: 'Create a chat room',
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'OK',
    type: CreateUserChatRoomResponseObject,
  })
  @ApiBody({ type: CreateUserChatRoomDto })
  async createUserChatRoom(
    @Param('userId') userId: string,
    @Body()
    body: CreateUserChatRoomDto,
  ): Promise<CreateUserChatRoomResponseObject> {
    return this.chatRoomsService.createUserChatRoom(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/chat-rooms')
  @ApiOperation({
    summary: 'Get user chat rooms',
  })
  @ApiQuery({ name: 'skip', required: true })
  @ApiQuery({ name: 'take', required: true })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: GetUserChatRoomsResponseObject,
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  getUserChatRooms(
    @Param('userId') userId: string,
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('take', new ParseIntPipe()) take: number,
  ): Promise<GetUserChatRoomsResponseObject> {
    return this.chatRoomsService.getUserChatRooms(userId, {
      skip,
      take,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/chat-rooms/:chatRoomId/messages')
  @ApiOperation({
    summary: 'Get chat room messages',
  })
  @ApiQuery({ name: 'skip', required: true })
  @ApiQuery({ name: 'take', required: true })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: PagedUserChatRoomMessages,
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  getChatRoomMessages(
    @Param('userId') userId: string,
    @Param('chatRoomId') chatRoomId: string,
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('take', new ParseIntPipe()) take: number,
  ): Promise<PagedUserChatRoomMessages> {
    return this.messagesService.getChatRoomMessages(userId, chatRoomId, {
      skip,
      take,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/chat-rooms/:chatRoomId')
  @ApiOperation({
    summary: 'Get chat room',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: ChatRoomResponseObject,
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  getChatRoom(
    @Param('userId') userId: string,
    @Param('chatRoomId') chatRoomId: string,
  ): Promise<ChatRoomResponseObject> {
    return this.chatRoomsService.getUserChatRoom(userId, chatRoomId);
  }
}
