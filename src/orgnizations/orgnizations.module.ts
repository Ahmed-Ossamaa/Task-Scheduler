import { Module } from '@nestjs/common';
import { OrgnizationsService } from './orgnizations.service';
import { OrgnizationsController } from './orgnizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/orgnization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [OrgnizationsController],
  providers: [OrgnizationsService],
})
export class OrgnizationsModule {}
