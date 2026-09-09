import { Module } from '@nestjs/common';
import { User } from './user';
import { UserController } from './user.controller';
import { RepositoryModule } from '@repository/repository.module';

@Module({
  providers: [User],
  controllers: [UserController],
  imports: [RepositoryModule],
})
export class UserModule {}
