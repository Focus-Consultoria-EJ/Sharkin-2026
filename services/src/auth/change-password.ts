import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { randomInt } from 'crypto';
import Redis from 'ioredis';

@Injectable()
export class ChangePassword implements OnModuleDestroy {
  private readonly redis = new Redis();

  async createVerificationCode(userId: string): Promise<string> {
    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    await this.redis.set(`pwd-reset:code:${userId}`, code, 'EX', 300);
    return code;
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
