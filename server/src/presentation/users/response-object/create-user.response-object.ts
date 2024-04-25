import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseObject {
  @ApiProperty()
  id: string;
}
