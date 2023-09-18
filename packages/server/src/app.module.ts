import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersPresentationModule } from './presentation/users';
import { join } from 'path';
import { cwd } from 'process';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(cwd(), 'schema.gql'),
      include: [UsersPresentationModule],
    }),
    UsersPresentationModule,
  ],
})
export class AppModule {}
