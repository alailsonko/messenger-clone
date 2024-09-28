import { Module } from '@nestjs/common';
import { AuthenticationClient } from './authentication/authentication.client';
import { UsersClient } from './users/users.client';

@Module({
  providers: [AuthenticationClient, UsersClient],
  exports: [AuthenticationClient, UsersClient],
})
export class ClientsModule {}
