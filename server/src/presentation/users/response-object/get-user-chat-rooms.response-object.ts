import { ApiProperty } from '@nestjs/swagger';
import { PagedResult } from 'src/common/types/paged-result.type';
import { IChatRoom } from 'src/domain/chatRooms/chat-rooms.interface';
import { IMessage } from 'src/domain/messages';
import { AvatarResponseObject } from 'src/presentation/auth/response-object/get-profile.response-object';

export class UserResponseObject {
  @ApiProperty({
    type: AvatarResponseObject,
    required: true,
  })
  avatar?: AvatarResponseObject;

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isStaff: boolean;

  @ApiProperty()
  isSuperUser: boolean;

  @ApiProperty()
  lastLogin: Date;
}

export class UserChatRoomResponseObject {
  @ApiProperty()
  chatRoomId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: UserResponseObject })
  user: UserResponseObject;
}

export class MessageResponseObject implements IMessage {
  @ApiProperty()
  chatRoomId: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  id: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: UserResponseObject })
  sender?: UserResponseObject;
}

export class ChatRoomResponseObject {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [UserChatRoomResponseObject] })
  usersChatRooms: UserChatRoomResponseObject[];

  @ApiProperty({ type: () => [MessageResponseObject] })
  messages: MessageResponseObject[];
}

export class GetUserChatRoomsResponseObject implements PagedResult<IChatRoom> {
  @ApiProperty({
    description: 'Chat rooms',
    type: [ChatRoomResponseObject],
  })
  data: IChatRoom[];
  @ApiProperty({
    description: 'Chat rooms count',
    example: 1,
    type: Number,
  })
  count: number;
}
