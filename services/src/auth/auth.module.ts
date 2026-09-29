import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { Auth } from './auth';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ChangePassword } from './change-password';
@Module({
  controllers: [AuthController],
  providers: [Auth, ChangePassword],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '5m',
      },
    }),
  ],
})
export class AuthModule {}
