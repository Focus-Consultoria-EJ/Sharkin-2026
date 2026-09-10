import { Test, TestingModule } from '@nestjs/testing';
import { Duty } from './duty';

describe('Duty', () => {
  let provider: Duty;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Duty],
    }).compile();

    provider = module.get<Duty>(Duty);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
