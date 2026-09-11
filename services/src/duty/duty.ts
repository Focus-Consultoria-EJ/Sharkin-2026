import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { DutyRepository } from '@repository/duties/duties.repository';
import { UsersRepository } from '@repository/users/users.repository';

@Injectable()
export class Duty {
  constructor(
    private dutyRepo: DutyRepository,
    private usersRepo: UsersRepository,
  ) {}

  async createDuty(userId: string) {
    if ((await this.usersRepo.findOne(userId)) === undefined) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return this.dutyRepo.create(userId);
  }

  async findAllDuties() {
    return await this.dutyRepo.findAll();
  }

  async findAllDutiesByUser(userId: string) {
    return await this.dutyRepo.findByUser(userId);
  }

  async closeDuty(userId: string) {
    const lastDutyRegistered =
      await this.dutyRepo.findLastOpenDutyByUser(userId);

    if (!lastDutyRegistered) {
      throw new ConflictException('Não há plantão aberto para ser fechado');
    }

    const closeTime = new Date();

    const updatedDuty = await this.dutyRepo.updateDateTimeOut(
      lastDutyRegistered.duty_id,
      closeTime.toISOString(),
    );
    return updatedDuty;
  }
}
