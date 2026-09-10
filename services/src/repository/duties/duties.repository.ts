import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@lib/prisma';
import { Duty } from '../../../generated/prisma/client';

@Injectable()
export class DutyRepository {
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

  async create(userId: string): Promise<Duty> {
    return prisma.duty.create({
      data: {
        user_id: userId,
      },
    });
  }
}
