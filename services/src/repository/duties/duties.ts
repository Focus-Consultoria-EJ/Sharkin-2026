import { Injectable } from '@nestjs/common';
import { prisma } from '@lib/prisma';
import { type DutyDto } from '@dtos/duty';

@Injectable()
export class Duties {
  async getAllDuties(): Promise<DutyDto[]> {
    const duties = await prisma.duties.findMany();

    if (!duties) {
      throw new Error(
        'Não foi possível buscar por todos os plantões, verifique duties na camada repository',
      );
    }
    return duties;
  }

  async getDutiesByUser(id: string): Promise<DutyDto[]> {
    const duties = await prisma.duties.findMany({
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

  async createDuty({
    duty_id,
    user_id,
    date,
    in_time,
    out_time = null,
  }: DutyDto): Promise<DutyDto | void> {
    try {
      const duty = await prisma.duties.create({
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
