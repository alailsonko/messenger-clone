import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DomainModule } from 'src/domain/domain.module';
import { InfraModule } from 'src/infra/infra.module';
import { AvatarsService } from './avatars.service';
import { CommandHandlers } from './commands/handlers';

@Module({
  imports: [CqrsModule, DomainModule, InfraModule],
  providers: [...CommandHandlers, AvatarsService],
  exports: [AvatarsService],
})
export class AvatarsApplicationModule {}
