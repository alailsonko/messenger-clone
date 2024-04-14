import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { ApplicationModule } from 'src/application/application.module';
import { AuthController } from './auth/auth.controller';
import { WSGateway } from './ws/ws.gateway';

@Module({
  imports: [ApplicationModule],
  controllers: [UsersController, AuthController],
  providers: [ApplicationModule, WSGateway],
})
export class PresentationModule {}
