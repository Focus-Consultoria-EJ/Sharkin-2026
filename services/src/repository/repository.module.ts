import { Module } from '@nestjs/common';
import { Duties } from './duties/duties';
import { Connection } from './connection/connection';

@Module({
  providers: [Duties, Connection],
})
export class RepositoryModule {}
