import { ApiProperty } from '@nestjs/swagger';

export class CheckUserChatRoomExistsResponseObject {
  @ApiProperty()
  id: string;
}
