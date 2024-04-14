import { ApiProperty } from '@nestjs/swagger';
import { PagedResult } from 'src/common/types/paged-result.type';
import { IChatRoom } from 'src/domain/chatRooms/chat-rooms.interface';
import { ChatRoom } from './CreateUserChatRoom.dto';

export class PagedUserChatRooms implements PagedResult<IChatRoom> {
  @ApiProperty({
    description: 'Chat rooms',
    type: [ChatRoom],
  })
  data: IChatRoom[];
  @ApiProperty({
    description: 'Chat rooms count',
    example: 1,
    type: Number,
  })
  count: number;
}
