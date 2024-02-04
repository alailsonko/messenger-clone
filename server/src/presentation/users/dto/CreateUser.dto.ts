import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsStrongPassword({
    minLength: 9,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
  })
  password: string;
}
