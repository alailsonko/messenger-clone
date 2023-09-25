import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseModel {
  @Field({ nullable: false })
  created_at: string;

  @Field({ nullable: false })
  updated_at: string;
}
