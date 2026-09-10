import { Module } from '@nestjs/common';
import { DutyRepository } from './duties/duties.repository';
import { Connection } from './connection/connection';
import { UsersRepository } from './users/users.repository';

@Module({
  providers: [DutyRepository, Connection, UsersRepository],
  exports: [DutyRepository, UsersRepository],
})
export class RepositoryModule {}
