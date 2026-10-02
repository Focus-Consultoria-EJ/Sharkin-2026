import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { randomInt } from 'crypto';
import { transporter } from '@config/nodemailer';
import Redis from 'ioredis';
import { User } from '../user/user';

@Injectable()
export class ChangePassword implements OnModuleDestroy {
  constructor(private userService: User) {}
  private readonly redis = new Redis();

  async createVerificationCode(userId: string): Promise<void> {
    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    await this.redis.set(`pwd-reset:code:${userId}`, code, 'EX', 300);

    const { email } = await this.userService.findUser(userId);

    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: 'Seu código de verificação', //Precisamos de um html para estilizar essa mensagem
      text: `Seu código é: ${code}`,
    });
  }

  async verifyCode(userId: string, code: string): Promise<boolean> {
    const stored = await this.redis.get(`pwd-reset:code:${userId}`);
    if (stored !== code) return false;

    await this.redis.del(`pwd-reset:code:${userId}`);
    return true;
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
