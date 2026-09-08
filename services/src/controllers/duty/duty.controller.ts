import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Duties } from '@repository/duties/duties.service';

@Controller('duty')
export class DutyController {
  constructor(private repo: Duties) {}

  @Get()
  async findAllDuties() {
    return await this.repo.findAll();
  }

  @Get(':id')
  async findDutiesByUser(@Param('id') id: string) {
    return await this.repo.findByUser(id);
  }
}
