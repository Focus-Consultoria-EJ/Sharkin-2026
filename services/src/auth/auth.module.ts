import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { Auth } from './auth';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  providers: [Auth],
  imports: [UserModule],
})
export class AuthModule {}
