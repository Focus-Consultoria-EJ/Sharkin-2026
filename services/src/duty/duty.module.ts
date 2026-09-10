import { Module } from '@nestjs/common';
import { DutyController } from './duty.controller';
import { Duty } from './duty';
import { RepositoryModule } from '@repository/repository.module';

@Module({
  controllers: [DutyController],
  providers: [Duty],
  imports: [RepositoryModule],
})
export class DutyModule {}
