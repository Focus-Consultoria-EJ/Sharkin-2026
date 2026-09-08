import { Module } from '@nestjs/common';
import { DutyController } from './duty/duty.controller';
import { RepositoryModule } from '@repository/repository.module';

@Module({
  controllers: [DutyController],
  imports: [RepositoryModule],
})
export class ControllersModule {}
