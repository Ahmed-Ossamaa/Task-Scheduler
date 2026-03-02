import { Controller } from '@nestjs/common';
import { OrgnizationsService } from './orgnizations.service';

@Controller('orgnizations')
export class OrgnizationsController {
  constructor(private readonly orgnizationsService: OrgnizationsService) {}
}
