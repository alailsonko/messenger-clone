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
import { ChatRoomsService } from 'src/application/chat-rooms/chat-rooms.service';
import { ChatRoom, CreateUserChatRoomDto } from './dto/CreateUserChatRoom.dto';
import { IChatRoom } from 'src/domain/chatRooms/chat-rooms.interface';
import { PagedUserChatRooms } from './dto/GetUserChatRooms.dto';
import { MessagesService } from 'src/application/messages/messages.service';
import { PagedUserChatRoomMessages } from './dto/GetUserChatRoomMessages.dto';

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
    type: ChatRoom,
  })
  @ApiBody({ type: CreateUserChatRoomDto })
  async createUserChatRoom(
    @Param('userId') userId: string,
    @Body()
    body: CreateUserChatRoomDto,
  ): Promise<IChatRoom> {
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
    type: PagedUserChatRooms,
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  getUserChatRooms(
    @Param('userId') userId: string,
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('take', new ParseIntPipe()) take: number,
  ): Promise<PagedUserChatRooms> {
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
    type: ChatRoom,
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  getChatRoom(
    @Param('userId') userId: string,
    @Param('chatRoomId') chatRoomId: string,
  ): Promise<IChatRoom> {
    return this.chatRoomsService.getUserChatRoom(userId, chatRoomId);
  }
}
