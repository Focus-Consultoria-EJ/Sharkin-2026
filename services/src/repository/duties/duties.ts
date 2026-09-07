import { Injectable } from '@nestjs/common';
import { prisma } from '@lib/prisma';
import { type DutyDto } from './dtos/duty';

@Injectable()
export class Duties {
  async findAll(): Promise<DutyDto[]> {
    const duties = await prisma.duty.findMany();

    if (!duties) {
      throw new Error(
        'Não foi possível buscar por todos os plantões, verifique duties na camada repository',
      );
    }
    return duties;
  }

  async findOne(id: string): Promise<DutyDto[]> {
    const duties = await prisma.duty.findMany({
      where: {
        duty_id: id,
      },
    });

    if (!duties) {
      throw new Error(
        `Não foi possível buscar por todos os plantões do usuário de id: ${id}, verifique duties na camada repository`,
      );
    }
    return duties;
  }

  async create({
    duty_id,
    user_id,
    date,
    in_time,
    out_time = null,
  }: DutyDto): Promise<DutyDto | void> {
    try {
      const duty = await prisma.duty.create({
        data: {
          duty_id,
          user_id,
          date,
          in_time,
          out_time,
        },
      });

      return duty;
    } catch (err) {
      throw err;
    }
  }
}
