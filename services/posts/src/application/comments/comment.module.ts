import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DataModule } from 'src/data/data.module';
import { InfraModule } from 'src/infra/infra.module';
import { CommmandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { CommentsApplicationService } from './comment.service';

@Module({
  imports: [CqrsModule, DataModule, InfraModule],
  providers: [CommentsApplicationService, ...CommmandHandlers, ...QueryHandlers],
  exports: [CommentsApplicationService],
})
export class CommentsModule {}
