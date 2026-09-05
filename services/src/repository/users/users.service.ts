import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryService } from '../repository.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

// Criação de um objeto de seleção para retornar apenas os campos públicos do usuário
const publicUserSelect = {
  user_id: true,
  name: true,
  email: true,
  is_active: true,
  created_at: true,
  updated_at: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: RepositoryService,
  ) {}

  // Método para criação de um novo usuário
  async create(dto: CreateUserDto){
    const name = dto.name.trim(); // Remove espaços em branco do início e do fim do nome do usuário
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.repository.client.user.findUnique( {where: { email }} );

    if (existingUser) {
      throw new ConflictException(
        'Já existe um usuário com esse e-mail.',
      );
    }

    const hashedPassword = await Bun.password.hash(dto.password);  //Usei uma função de hash de senha do Bun para garantir a segurança da senha do usuário

    return this.repository.client.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },

      select: publicUserSelect, 
    });
  }

  // Método que retorna todos os usários ativos do banco de dados, ordenados pela data de criação em ordem decrescente
  async findAll() {
    return this.repository.client.user.findMany({
      where: {
        is_active: true,
      },

      select: publicUserSelect,

      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // Método que retorna um usuário específico pelo seu ID, caso ele exista e esteja ativo
  async findOne(userId: string) {
    const user =
      await this.repository.client.user.findUnique({
        where: {
          user_id: userId,
        },

        select: publicUserSelect,
      });

    if (!user || !user.is_active) {
      throw new NotFoundException(
        'Usuário não encontrado.',
      );
    }

    return user;
  }

  // Método que atualiza as informações de um usuário específico, caso ele exista e esteja ativo
  async update( userId: string, dto: UpdateUserDto,) {
    const user =
      await this.repository.client.user.findUnique({
        where: {
          user_id: userId,
        },
      });

    if (!user || !user.is_active) {
      throw new NotFoundException(
        'Usuário não encontrado.',
      );
    }

    const data: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();

      const emailOwner =
        await this.repository.client.user.findUnique({
          where: {
            email,
          },
        });

      if ( emailOwner && emailOwner.user_id !== userId) {
        throw new ConflictException(
          'Já existe um usuário com esse e-mail.',
        );
      }

      data.email = email;
    }

    if (dto.password !== undefined) {
      data.password = await Bun.password.hash(dto.password);
    }

    return this.repository.client.user.update({
      where: {
        user_id: userId,
      }, 

      data,

      select: publicUserSelect,
    });
  }

  // Método que desativa um usuário específico (Delete lógico)
  async delete(userId: string) {
    const user =
      await this.repository.client.user.findUnique({
        where: {
          user_id: userId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado.',
      );
    }

    if (!user.is_active) {
      throw new ConflictException(
        'Usuário já está desativado.',
      );
    }

    return this.repository.client.user.update({
      where: {
        user_id: userId,
      },

      data: {
        is_active: false,
      },

      select: publicUserSelect,
    });
  } 

  // Método que reativa um usuário específico (Delete reverso)
  async restore(userId: string) {
    const user =
      await this.repository.client.user.findUnique({
        where: {
          user_id: userId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado.',
      );
    }

    if (user.is_active) {
      throw new ConflictException(
        'Usuário já está ativo.',
      );
    }

    return this.repository.client.user.update({
      where: {
        user_id: userId,
      },

      data: {
        is_active: true,
      },

      select: publicUserSelect,
    });
  }
}