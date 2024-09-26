import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { CommentsRepository } from './repository/comments.repository';
import { PostsRepository } from './repository/posts.repository';
import { MediasRepository } from './repository/medias.repository';

@Module({
  imports: [InfraModule],
  exports: [CommentsRepository, PostsRepository, MediasRepository],
  providers: [CommentsRepository, PostsRepository, MediasRepository],
})
export class DataModule {}
