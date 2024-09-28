import { Module } from '@nestjs/common';
import { UserService } from './users/users.service';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [DataModule],
  providers: [UserService],
  exports: [UserService],
})
export class ApplicationModule {}
