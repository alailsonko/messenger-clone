import { ApiProperty } from '@nestjs/swagger';
import { PagedResult } from 'src/common/types/paged-result.type';
import { IMessage } from 'src/domain/messages/message.interface';

export class Message implements IMessage {
  @ApiProperty({
    description: 'Message ID',
    example: '1',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, world!',
    type: String,
  })
  content: string;

  @ApiProperty({
    description: 'Message sender ID',
    example: '1',
    type: String,
  })
  senderId: string;

  @ApiProperty({
    description: 'Chat room ID',
    example: '1',
    type: String,
  })
  chatRoomId: string;

  @ApiProperty({
    description: 'Message creation date',
    example: '2021-07-01T00:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Message last update date',
    example: '2021-07-01T00:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;
}

export class PagedUserChatRoomMessages implements PagedResult<IMessage> {
  @ApiProperty({
    description: 'Messages',
    type: [Message],
  })
  data: IMessage[];
  @ApiProperty({
    description: 'Messages count',
    example: 1,
    type: Number,
  })
  count: number;
}
