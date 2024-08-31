import { IsString, IsNotEmpty } from 'class-validator';

export class IssueTokenDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
