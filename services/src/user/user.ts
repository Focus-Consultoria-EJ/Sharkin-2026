import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dtos';
import { UsersRepository } from '@repository/users/users.repository';

@Injectable()
export class User {
  constructor(private repository: UsersRepository) {}

  async findUser(id: string) {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new NotFoundException(
        `Usuário de id: ${id} não encontrado ou está desativado`,
      );
    }

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        `Usuário de email: ${email} não encontrado ou está desativado`,
      );
    }

    return user;
  }

  async findAllUsers() {
    return await this.repository.findAll();
  }

  async createUser(data: CreateUserDto) {
    const { password, email, name } = data;

    const hash = await Bun.password.hash(password);

    const existingUser = await this.repository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Usuário já cadastrado');
    }

    const id = crypto.randomUUID();
    const new_user = {
      password: hash,
      email: email.trim().toLowerCase(),
      name: name,
      user_id: id,
      is_active: true,
    };

    await this.repository.create(new_user);
    return new_user;
  }

  async desactivateUser(id: string) {
    const user = await this.repository.deactivateUser(id);

    if (!user) {
      throw new ConflictException('Usuário não encontrado');
    }

    return user;
  }

  async updatePasswordIfUnchanged( userId: string, previousHash: string, newHash: string): Promise<boolean> {
    return this.repository.updatePasswordIfUnchanged(
      userId,
      previousHash,
      newHash,
    );
  }
}
