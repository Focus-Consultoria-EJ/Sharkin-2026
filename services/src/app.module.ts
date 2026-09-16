import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository/repository.module';
import { UserModule } from './user/user.module';
import { DutyModule } from './duty/duty.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RepositoryModule, UserModule, DutyModule, AuthModule],
})
export class AppModule {}
