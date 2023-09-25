import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class signUpUserInputDTO {
  @Field({ nullable: false })
  @IsEmail()
  email: string;

  @Field({ nullable: false })
  @IsString()
  username: string;

  @Field({ nullable: false })
  @IsString()
  password: string;
}

@InputType()
export class signInUserInputDTO {
  @Field({ nullable: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: false })
  @IsOptional()
  @IsString()
  username?: string;

  @Field({ nullable: false })
  @IsString()
  password: string;
}
