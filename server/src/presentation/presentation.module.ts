import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { ApplicationModule } from 'src/application/application.module';
import { AuthController } from './auth/auth.controller';
import { WSGateway } from './ws/ws.gateway';
import { AvatarsController } from './avatars/avatars.controller';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [ApplicationModule, InfraModule],
  controllers: [UsersController, AuthController, AvatarsController],
  providers: [ApplicationModule, WSGateway],
})
export class PresentationModule {}
