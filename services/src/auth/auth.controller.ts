import { Body, Controller, Post } from '@nestjs/common';
import {
  SignInDto,
  CreateCodeDto,
  VerifyCodeDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { Auth } from './auth';
import { ChangePassword } from './change-password';
import { User } from '../user/user';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: Auth,
    private changePasswordService: ChangePassword,
    private userService: User,
  ) {}

  @Post('sign-in')
  signIn(@Body() signInPayload: SignInDto) {
    return this.authService.authUser(
      signInPayload.email,
      signInPayload.password,
    );
  }

  @Post('change-password/generate')
  async createCode(@Body() { email }: CreateCodeDto) {
    const { user_id } = await this.userService.findUserByEmail(email);
    const code =
      await this.changePasswordService.createVerificationCode(user_id);
    return { message: 'Código gerado', code };
  }

  @Post('change-password/verify')
  async verifyCode(@Body() { email, token }: VerifyCodeDto) {
    const { user_id } = await this.userService.findUserByEmail(email);

    const valid = await this.changePasswordService.verifyCode(user_id, token);
    return { valid };
  }

  @Post('change-password/reset')
  async resetPassword(@Body() { email, token, password }: ResetPasswordDto) {
    const { user_id } = await this.userService.findUserByEmail(email);

    await this.changePasswordService.resetPassword(user_id, token, password);

    return { message: 'Senha redefinida com sucesso.' };
  }
}
