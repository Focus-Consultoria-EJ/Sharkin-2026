import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto, CreateCodeDto, VerifyCodeDto, ResetPasswordDto } from './dto/auth.dto';
import { Auth } from './auth';
import { ChangePassword } from './change-password';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: Auth,
    private changePasswordService: ChangePassword,
  ) {}

  @Post('sign-in')
  signIn(@Body() signInPayload: SignInDto) {
    return this.authService.authUser(
      signInPayload.email,
      signInPayload.password,
    );
  }

  @Post('change-password/generate')
  async createCode(@Body() { userId }: CreateCodeDto) {
    const code =
      await this.changePasswordService.createVerificationCode(userId);
    return { message: 'Código gerado', code };
  }

  @Post('change-password/verify')
  async verifyCode(@Body() { userId, token }: VerifyCodeDto) {
    const valid = await this.changePasswordService.verifyCode(userId, token);
    return { valid };
  }

  @Post('change-password/reset')
  async resetPassword(
    @Body() { userId, token, password }: ResetPasswordDto,
  ) {
    await this.changePasswordService.resetPassword(
      userId,
      token,
      password,
    );

    return { message: 'Senha redefinida com sucesso.' };
  }
}
