import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '@lib/prisma';
import { CreateUserDto } from '../../user/dto/user.dtos';

@Injectable()
export class UsersRepository {
  async create(user: CreateUserDto) {
    return await prisma.user.create({
      data: {
        ...user,
      },
    });
  }

  async findAll() {
    return prisma.user.findMany({
      where: {
        is_active: true,
      },

      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!user || !user.is_active) {
      throw new NotFoundException('Usuário não encontrado ou desativado.');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    return user;
  }

  async deactivateUser(id: string) {
    const user = prisma.user.update({
      where: {
        user_id: id,
      },
      data: {
        is_active: false,
      },
    });

    return user;
  }
}
