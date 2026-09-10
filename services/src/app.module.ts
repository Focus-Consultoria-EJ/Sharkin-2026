import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository/repository.module';
import { UserModule } from './user/user.module';
import { DutyModule } from './duty/duty.module';

@Module({
  imports: [RepositoryModule, UserModule, DutyModule],
})
export class AppModule {}
