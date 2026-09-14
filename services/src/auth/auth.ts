import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from './dto/auth.dto';

@Injectable()
export class Auth {
  constructor(
    private userService: User,
    private jwtService: JwtService,
  ) {}

  async authUser(email: string, password: string): Promise<AccessTokenDto> {
    try {
      const userData = await this.userService.findUserByEmail(email);

      const isMatch = await Bun.password.verify(password, userData.password);

      if (!isMatch) {
        throw new UnauthorizedException('Email ou senha incorreta');
      }

      const payload = {
        sub: userData.user_id,
        username: userData.name,
      };

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (err) {
      throw err;
    }
  }
}
