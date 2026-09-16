import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dto/auth.dto';
import { Auth } from './auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: Auth) {}

  @Post('sign-in')
  signIn(@Body() signInPayload: SignInDto) {
    return this.authService.authUser(
      signInPayload.email,
      signInPayload.password,
    );
  }
}
