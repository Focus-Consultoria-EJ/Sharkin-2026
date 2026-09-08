import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository/repository.module';
import { ControllersModule } from './controllers/controllers.module';

@Module({
  imports: [RepositoryModule, ControllersModule],
  providers: [],
})
export class AppModule {}
