import { Module } from '@nestjs/common';
import { UsersApplicationModule } from './users/users.module';

@Module({
  imports: [UsersApplicationModule],
  providers: [UsersApplicationModule],
})
export class ApplicationModule {}
