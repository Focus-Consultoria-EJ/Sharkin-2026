import { Test, TestingModule } from '@nestjs/testing';
import { DutyController } from './duty.controller';

describe('DutyController', () => {
  let controller: DutyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DutyController],
    }).compile();

    controller = module.get<DutyController>(DutyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
