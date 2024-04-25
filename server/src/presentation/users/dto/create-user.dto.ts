import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: 'string',
  })
  @IsStrongPassword({
    minLength: 9,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
  })
  password: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  lastName: string;
}
