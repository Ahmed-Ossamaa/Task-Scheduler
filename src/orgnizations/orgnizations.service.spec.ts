import { Test, TestingModule } from '@nestjs/testing';
import { OrgnizationsService } from './orgnizations.service';

describe('OrgnizationsService', () => {
  let service: OrgnizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgnizationsService],
    }).compile();

    service = module.get<OrgnizationsService>(OrgnizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
