import { Test, TestingModule } from '@nestjs/testing';
import { Duties } from './duties.repository';

describe('Duties', () => {
  let provider: Duties;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Duties],
    }).compile();

    provider = module.get<Duties>(Duties);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
