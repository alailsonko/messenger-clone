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

  @Field({ nullable: true })
  profileImageUrl: string;
}

export interface UsersEntity {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  profile_image_url: string;
  created_at: Date;
  updated_at: Date;
}
