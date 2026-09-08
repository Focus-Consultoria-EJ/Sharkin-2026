import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@lib/prisma';
import { Duty } from '../../../generated/prisma/client';

@Injectable()
export class Duties {
  async findAll(): Promise<Duty[]> {
    const duties = await prisma.duty.findMany();
    return duties;
  }

  async findByUser(id: string): Promise<Duty[]> {
    const duties = await prisma.duty.findMany({
      where: {
        user_id: id,
      },
    });
    return duties;
  }

  async create({
    duty_id,
    user_id,
    date,
    in_time,
    out_time = null,
  }: Duty): Promise<Duty | void> {
    const duty = await prisma.duty.create({
      data: {
        duty_id,
        user_id,
        date,
        in_time,
        out_time,
      },
    });
  }
}
