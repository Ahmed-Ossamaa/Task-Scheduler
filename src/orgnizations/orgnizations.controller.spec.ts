import { Test, TestingModule } from '@nestjs/testing';
import { OrgnizationsController } from './orgnizations.controller';
import { OrgnizationsService } from './orgnizations.service';

describe('OrgnizationsController', () => {
  let controller: OrgnizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgnizationsController],
      providers: [OrgnizationsService],
    }).compile();

    controller = module.get<OrgnizationsController>(OrgnizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
