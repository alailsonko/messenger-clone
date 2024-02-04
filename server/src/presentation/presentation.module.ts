import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { ApplicationModule } from 'src/application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [UsersController],
  providers: [ApplicationModule],
})
export class PresentationModule {}
