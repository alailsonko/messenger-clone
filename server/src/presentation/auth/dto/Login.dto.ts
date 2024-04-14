import { ApiProperty } from '@nestjs/swagger';

export class Login {
  @ApiProperty({ type: String, required: true })
  email: string;

  @ApiProperty({ type: String, required: true })
  password: string;
}
