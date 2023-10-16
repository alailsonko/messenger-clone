import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseModel } from 'src/common';

@ObjectType()
export class Users extends BaseModel {
  @Field(() => ID)
  id: string;

  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: true })
  profileImageUrl: string;
}

@ObjectType()
export class AccessToken {
  @Field({ nullable: true })
  access_token: string;
}
