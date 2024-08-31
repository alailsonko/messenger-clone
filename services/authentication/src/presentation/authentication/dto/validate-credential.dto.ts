import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateCredentialDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
