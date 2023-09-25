import { Module } from '@nestjs/common';
import { RepositoriesModule } from './repositories';

@Module({
  imports: [RepositoriesModule],
  exports: [RepositoriesModule],
})
export class DataModule {}
