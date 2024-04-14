import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayUnique,
} from 'class-validator';
import { IChatRoom } from 'src/domain/chatRooms/chat-rooms.interface';

export class CreateUserChatRoomDto {
  @ApiProperty({
    description: 'Chat room name',
    example: 'Chat room 1',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User IDs',
    example: ['1', '2'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  userIds: string[];
}

export class ChatRoom implements IChatRoom {
  @ApiProperty({
    description: 'Chat room ID',
    example: '1',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Chat room name',
    example: 'Chat room 1',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Chat room creation date',
    example: '2021-07-01T00:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Chat room last update date',
    example: '2021-07-01T00:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;
}
