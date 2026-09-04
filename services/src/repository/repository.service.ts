import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma } from '@lib/prisma';

@Injectable()
export class RepositoryService implements OnModuleInit, OnModuleDestroy
{
  readonly client = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}