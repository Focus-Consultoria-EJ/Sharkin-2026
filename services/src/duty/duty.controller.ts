import { Controller, Get, Patch, Post, Body, Param } from '@nestjs/common';
import { Duty } from './duty';

@Controller('duty')
export class DutyController {
  constructor(private dutyService: Duty) {}

  @Get()
  async findAllDuties() {
    return await this.dutyService.findAllDuties();
  }

  @Get('/:id')
  async findAllDutiesByUser(@Param('id') userId: string) {
    return await this.dutyService.findAllDutiesByUser(userId);
  }

  @Post('/:id')
  async createDuty(@Param('id') userId: string) {
    return await this.dutyService.createDuty(userId);
  }

  @Patch()
  async registerOutTime() {
    return 'registrando ponto de saida';
  }
}
