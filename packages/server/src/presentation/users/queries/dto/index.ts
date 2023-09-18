import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class getUserDTO {
  @Field(() => ID, { nullable: true, defaultValue: null })
  @IsOptional()
  id?: string;

  @Field({ nullable: true, defaultValue: null })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true, defaultValue: null })
  @IsOptional()
  @IsString()
  username?: string;
}
