import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayUnique,
} from 'class-validator';

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
