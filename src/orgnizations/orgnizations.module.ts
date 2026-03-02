import { Module } from '@nestjs/common';
import { OrgnizationsService } from './orgnizations.service';
import { OrgnizationsController } from './orgnizations.controller';

@Module({
  controllers: [OrgnizationsController],
  providers: [OrgnizationsService],
})
export class OrgnizationsModule {}
