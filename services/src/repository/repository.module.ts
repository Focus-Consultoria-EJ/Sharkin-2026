import { Module } from '@nestjs/common';
import { Duties } from './duties/duties.service';
import { Connection } from './connection/connection';
import { UsersService } from './users/users.service';

@Module({
  providers: [Duties, Connection, UsersService],
  exports: [Duties, UsersService],
})
export class RepositoryModule {}
