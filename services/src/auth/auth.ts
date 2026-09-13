import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user';

@Injectable()
export class Auth {
  constructor(private userService: User) {}

  async authUser(email: string, password: string) {
    try {
      const userData = await this.userService.findUserByEmail(email);

      const isMatch = await Bun.password.verify(password, userData.password);

      if (!isMatch) {
        throw new UnauthorizedException('Email ou senha incorreta');
      }

      return {
        isMatch: isMatch,
        userData: {
          email: userData.email,
        },
        jwt: 'asodoiajsdijo',
      };
    } catch (err) {
      throw err;
    }
  }
}
