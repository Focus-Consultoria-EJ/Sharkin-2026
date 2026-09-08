import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dtos';

type UserType = {
  id: string;
  name: string;
  email: string;
};

@Injectable()
export class User {
  private userRepository: UserType[] = [];

  findUser(id: string) {
    const user = this.userRepository.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`Usuário de id: ${id} não encontrado`);
    }

    return user;
  }

  findAllUsers() {
    return this.userRepository;
  }

  findUserByEmail(email: string) {
    return this.userRepository.find((user) => user.email === email);
  }

  createUser(data: CreateUserDto) {
    const id = crypto.randomUUID();
    const new_user = {
      ...data,
      id: id,
    };

    if (
      this.userRepository.find((user) => user.id === id) ||
      this.userRepository.find((user) => user.email === new_user.email)
    ) {
      throw new ConflictException('Usuário já cadastrado');
    }

    this.userRepository.push(new_user);
    return new_user;
  }
}
