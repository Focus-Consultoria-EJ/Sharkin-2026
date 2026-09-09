import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository/repository.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [RepositoryModule, UserModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
