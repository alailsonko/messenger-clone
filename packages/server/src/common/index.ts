import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseModel {
  @Field({ nullable: false })
  createdAt: string;

  @Field({ nullable: false })
  updatedAt: string;
}
