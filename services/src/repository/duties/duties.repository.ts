import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@lib/prisma';
import { Duty } from '@generated/prisma/client';

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

  async findLastOpenDutyByUser(userId: string): Promise<Duty | null> {
    return await prisma.duty.findFirst({
      where: {
        dateTime_out: null,
      },
    });
  }

  async create(userId: string): Promise<Duty> {
    return prisma.duty.create({
      data: {
        user_id: userId,
      },
    });
  }

  async updateDateTimeOut(dutyId: string, closeTime: string): Promise<Duty> {
    return await prisma.duty.update({
      where: {
        duty_id: dutyId,
      },
      data: {
        dateTime_out: closeTime,
      },
    });
  }
}
