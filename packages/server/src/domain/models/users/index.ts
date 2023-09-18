import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseModel } from 'src/common';

@ObjectType()
export class Users extends BaseModel {
  @Field(() => ID)
  id: number;

  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  passwordHash: string;

  @Field({ nullable: false })
  profileImageUrl: string;
}
