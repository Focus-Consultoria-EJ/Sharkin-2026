import { Module } from '@nestjs/common';
import { Duties } from './duties/duties.repository';
import { Connection } from './connection/connection';
import { UsersRepository } from './users/users.repository';

@Module({
  providers: [Duties, Connection, UsersRepository],
  exports: [Duties, UsersRepository],
})
export class RepositoryModule {}
